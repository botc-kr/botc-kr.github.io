require Logger

defmodule DownloadCsvFromGoogleSheet do
  @default_spreadsheet_id "1vpUdjIl2PK25YMTSEItw6JN6gHGfEU67yMWnGMc7LC0"
  @default_out_dir "assets/csv"
  @default_targets [
    {:gid, "1289885206", "ko_KR.csv"},
    {:gid, "123908000", "scripts.csv"}
  ]

  def run(argv) do
    {opts, _args, invalid_opts} =
      OptionParser.parse(argv,
        strict: [
          spreadsheet_id: :string,
          out_dir: :string,
          target: :keep,
          target_gid: :keep,
          timeout_ms: :integer
        ],
        aliases: [s: :spreadsheet_id, o: :out_dir, t: :target]
      )

    if invalid_opts != [] do
      invalid_flags = Enum.map_join(invalid_opts, ", ", fn {flag, _value} -> "--#{flag}" end)
      raise ArgumentError, "Unsupported options: #{invalid_flags}"
    end

    spreadsheet_id =
      opts[:spreadsheet_id] ||
        System.get_env("BOTC_TRANSLATIONS_SPREADSHEET_ID") ||
        @default_spreadsheet_id

    out_dir = opts[:out_dir] || @default_out_dir
    timeout_ms = opts[:timeout_ms] || 15_000
    targets = resolve_targets(opts)
    resolved_targets = resolve_sheet_targets(spreadsheet_id, targets, timeout_ms)

    Logger.info("Downloading CSV tabs from spreadsheet #{spreadsheet_id}")
    Logger.info("Targets: #{Enum.map_join(resolved_targets, ", ", &describe_target/1)}")
    Logger.info("Output directory: #{out_dir}\n")

    File.mkdir_p!(out_dir)

    failures =
      Enum.reduce(resolved_targets, [], fn target, acc ->
        case download_csv(spreadsheet_id, target, out_dir, timeout_ms) do
          :ok -> acc
          {:error, reason} -> [{target_label(target), reason} | acc]
        end
      end)
      |> Enum.reverse()

    if failures == [] do
      Logger.info("Done. Successfully downloaded #{length(targets)} CSV file(s).")
    else
      Enum.each(failures, fn {target, reason} ->
        Logger.error("Failed to download #{inspect(target)}: #{reason}")
      end)

      raise "Failed targets: #{Enum.map_join(failures, ", ", fn {target, _} -> target end)}"
    end
  end

  defp resolve_targets(opts) do
    gid_targets = Keyword.get_values(opts, :target_gid) |> Enum.map(&parse_target_gid!/1)
    sheet_targets = Keyword.get_values(opts, :target) |> Enum.map(&parse_target!/1)

    case gid_targets ++ sheet_targets do
      [] when gid_targets == [] and sheet_targets == [] ->
        @default_targets

      parsed_targets ->
        parsed_targets
    end
  end

  defp parse_target!(value) do
    case String.split(value, ":", parts: 2) do
      [tab_name, file_name] ->
        tab_name = String.trim(tab_name)
        file_name = String.trim(file_name)

        if tab_name == "" or file_name == "" do
          raise ArgumentError,
                "Invalid --target #{inspect(value)}. Expected format: --target \"<TAB_NAME>:<FILE_NAME>.csv\""
        end

        {:sheet, tab_name, file_name}

      _ ->
        raise ArgumentError,
              "Invalid --target #{inspect(value)}. Expected format: --target \"<TAB_NAME>:<FILE_NAME>.csv\""
    end
  end

  defp parse_target_gid!(value) do
    case String.split(value, ":", parts: 2) do
      [gid, file_name] ->
        gid = String.trim(gid)
        file_name = String.trim(file_name)

        if gid == "" or file_name == "" or not String.match?(gid, ~r/^\d+$/) do
          raise ArgumentError,
                "Invalid --target-gid #{inspect(value)}. Expected format: --target-gid \"<GID>:<FILE_NAME>.csv\""
        end

        {:gid, gid, file_name}

      _ ->
        raise ArgumentError,
              "Invalid --target-gid #{inspect(value)}. Expected format: --target-gid \"<GID>:<FILE_NAME>.csv\""
    end
  end

  defp resolve_sheet_targets(spreadsheet_id, targets, timeout_ms) do
    requested_sheet_names =
      targets
      |> Enum.flat_map(fn
        {:sheet, sheet_name, _file_name} -> [sheet_name]
        _ -> []
      end)

    if requested_sheet_names == [] do
      targets
    else
      tab_captions = fetch_tab_captions(spreadsheet_id, timeout_ms)

      Enum.map(targets, fn
        {:sheet, requested_name, file_name} ->
          {:sheet, resolve_actual_tab_name(requested_name, tab_captions), file_name}

        other ->
          other
      end)
    end
  end

  defp fetch_tab_captions(spreadsheet_id, timeout_ms) do
    edit_url = "https://docs.google.com/spreadsheets/d/#{spreadsheet_id}/edit"

    case http_get(edit_url, timeout_ms) do
      {:ok, body} ->
        Regex.scan(~r/docs-sheet-tab-caption\">(.*?)<\/div>/u, body, capture: :all_but_first)
        |> List.flatten()
        |> Enum.uniq()

      {:error, reason} ->
        raise "Failed to read spreadsheet tab metadata: #{reason}"
    end
  end

  defp resolve_actual_tab_name(requested_name, tab_captions) do
    normalized_requested = normalize_tab_name(requested_name)

    case Enum.find(tab_captions, fn caption ->
           caption == requested_name or normalize_tab_name(caption) == normalized_requested
         end) do
      nil ->
        raise "Could not find tab #{inspect(requested_name)}. Available tabs: #{inspect(tab_captions)}"

      matched ->
        matched
    end
  end

  defp normalize_tab_name(name) do
    name
    |> String.replace(~r/[\x00-\x1F\x7F]/u, "")
    |> String.trim()
  end

  defp download_csv(spreadsheet_id, {:gid, gid, file_name}, out_dir, timeout_ms) do
    file_path = Path.join(out_dir, file_name)
    url = build_csv_export_url_by_gid(spreadsheet_id, gid)
    Logger.info("Downloading gid=#{gid} from #{url}")

    case download_body(url, timeout_ms) do
      {:ok, body} ->
        File.write!(file_path, body)
        Logger.info("Saved gid=#{gid} -> #{file_path}\n")
        :ok

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp download_csv(spreadsheet_id, {:sheet, sheet_name, file_name}, out_dir, timeout_ms) do
    file_path = Path.join(out_dir, file_name)
    url = build_csv_export_url_by_sheet(spreadsheet_id, sheet_name)
    Logger.info("Downloading sheet=#{inspect(sheet_name)} from #{url}")

    case download_body(url, timeout_ms) do
      {:ok, body} ->
        File.write!(file_path, body)
        Logger.info("Saved sheet=#{inspect(sheet_name)} -> #{file_path}\n")
        :ok

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp download_body(url, timeout_ms) do

    case http_get(url, timeout_ms) do
      {:ok, body} ->
        if String.starts_with?(String.trim_leading(body), "<!DOCTYPE html>") do
          {:error, "Received HTML instead of CSV. Check sharing settings and target ID/name."}
        else
          {:ok, body}
        end

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp build_csv_export_url_by_sheet(spreadsheet_id, tab_name) do
    encoded_sheet_name = URI.encode(tab_name)
    "https://docs.google.com/spreadsheets/d/#{spreadsheet_id}/gviz/tq?tqx=out:csv&sheet=#{encoded_sheet_name}"
  end

  defp build_csv_export_url_by_gid(spreadsheet_id, gid) do
    "https://docs.google.com/spreadsheets/d/#{spreadsheet_id}/export?format=csv&gid=#{gid}"
  end

  defp describe_target({:gid, gid, file_name}), do: "gid=#{gid} -> #{file_name}"
  defp describe_target({:sheet, sheet_name, file_name}), do: "sheet=#{inspect(sheet_name)} -> #{file_name}"

  defp target_label({:gid, gid, _file_name}), do: "gid=#{gid}"
  defp target_label({:sheet, sheet_name, _file_name}), do: "sheet=#{inspect(sheet_name)}"

  defp http_get(url, timeout_ms) do
    :inets.start()
    :ssl.start()

    request = {String.to_charlist(url), []}
    http_options = [timeout: timeout_ms, connect_timeout: timeout_ms, autoredirect: true]
    options = [body_format: :binary]

    case :httpc.request(:get, request, http_options, options) do
      {:ok, {{_http_version, 200, _reason_phrase}, _headers, body}} ->
        {:ok, body}

      {:ok, {{_http_version, status_code, _reason_phrase}, _headers, _body}} ->
        {:error, "HTTP #{status_code}"}

      {:error, reason} ->
        {:error, inspect(reason)}
    end
  end
end

DownloadCsvFromGoogleSheet.run(System.argv())
