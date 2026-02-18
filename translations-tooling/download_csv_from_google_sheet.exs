require Logger

defmodule DownloadCsvFromGoogleSheet do
  @default_spreadsheet_id "1vpUdjIl2PK25YMTSEItw6JN6gHGfEU67yMWnGMc7LC0"
  @default_out_dir "assets/csv"
  @default_targets [
    {"Characters", "ko_KR.csv"},
    {"Scripts", "scripts.csv"}
  ]

  def run(argv) do
    {opts, _args, invalid_opts} =
      OptionParser.parse(argv,
        strict: [
          spreadsheet_id: :string,
          out_dir: :string,
          target: :keep,
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

    Logger.info("Downloading CSV tabs from spreadsheet #{spreadsheet_id}")
    Logger.info("Targets: #{Enum.map_join(targets, ", ", fn {tab, file} -> "#{tab} -> #{file}" end)}")
    Logger.info("Output directory: #{out_dir}\n")

    File.mkdir_p!(out_dir)

    failures =
      Enum.reduce(targets, [], fn {tab_name, file_name}, acc ->
        case download_tab_csv(spreadsheet_id, tab_name, Path.join(out_dir, file_name), timeout_ms) do
          :ok -> acc
          {:error, reason} -> [{tab_name, reason} | acc]
        end
      end)
      |> Enum.reverse()

    if failures == [] do
      Logger.info("Done. Successfully downloaded #{length(targets)} CSV file(s).")
    else
      Enum.each(failures, fn {tab_name, reason} ->
        Logger.error("Failed to download tab #{inspect(tab_name)}: #{reason}")
      end)

      raise "Failed tabs: #{Enum.map_join(failures, ", ", fn {tab_name, _} -> tab_name end)}"
    end
  end

  defp resolve_targets(opts) do
    case Keyword.get_values(opts, :target) do
      [] ->
        @default_targets

      target_values ->
        Enum.map(target_values, &parse_target!/1)
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

        {tab_name, file_name}

      _ ->
        raise ArgumentError,
              "Invalid --target #{inspect(value)}. Expected format: --target \"<TAB_NAME>:<FILE_NAME>.csv\""
    end
  end

  defp download_tab_csv(spreadsheet_id, tab_name, file_path, timeout_ms) do
    url = build_csv_export_url(spreadsheet_id, tab_name)
    Logger.info("Downloading #{tab_name} from #{url}")

    case http_get(url, timeout_ms) do
      {:ok, body} ->
        if String.starts_with?(String.trim_leading(body), "<!DOCTYPE html>") do
          {:error, "Received HTML instead of CSV. Check sharing settings and tab name."}
        else
          File.write!(file_path, body)
          Logger.info("Saved #{tab_name} -> #{file_path}\n")
          :ok
        end

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp build_csv_export_url(spreadsheet_id, tab_name) do
    encoded_sheet_name = URI.encode(tab_name)
    "https://docs.google.com/spreadsheets/d/#{spreadsheet_id}/gviz/tq?tqx=out:csv&sheet=#{encoded_sheet_name}"
  end

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
