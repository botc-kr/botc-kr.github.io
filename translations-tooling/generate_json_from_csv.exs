require Logger

# This script will generate JSON files for clocktower.online and Nara from the google sheet we use for translations:
# Download the csv from https://docs.google.com/spreadsheets/d/183HMp4ZgslxA4NtFVTXhY3xAbg7FIXZdmVnh9-4A_14/edit#gid=1546765235
# In "ko_KR" tab

# Usage: mix run generate_json_from_csv.exs

defmodule GenerateJsonFromCsv do
  # Main function
  def process_csv(csv_path) do
    Logger.info("Starting to process #{inspect(csv_path, pretty: true)}\n")

    locale =
      csv_path
      |> Path.rootname()
      |> Path.basename()

    roles_from_csv =
      csv_path
      |> File.stream!()
      |> CSV.decode!(headers: true, strip_fields: true)

    parsed_roles_from_csv =
      Enum.reduce(
        roles_from_csv,
        %{},
        fn row, acc ->
          # Convert a csv row to a role map with the same format as the clocktower.online ones.
          parsed_csv_co_role = from_csv_row_to_co_role(row)
          role_id = parsed_csv_co_role["id"]

          # Prune all empty fields.
          pruned_csv_co_role =
            Enum.reject(parsed_csv_co_role, fn {_key, value} ->
              value == nil or value == "" or value == []
            end)
            |> Enum.into(%{})

          Map.put(acc, role_id, pruned_csv_co_role)
        end
      )

    # Load roles from clocktower.online's roles.json file (https://github.com/bra1n/townsquare/blob/develop/src/roles.json). We use this to automatically add data like night order and teams to the translations. "co" stands for clocktower.online.
    co_roles =
      "assets/json/en_GB.json"
      |> File.read!()
      |> Jason.decode!()
      |> Enum.reduce(%{}, fn co_role, acc ->
        Map.put(acc, co_role["id"], co_role)
      end)

    merged_with_all_co_roles =
      Enum.reduce(co_roles, [], fn {co_role_id, co_role}, acc ->
        merged_role =
          case parsed_roles_from_csv[co_role_id] do
            nil ->
              Logger.warn("role_id not found in your csv #{inspect(co_role_id, pretty: true)}\n")
              co_role

            parsed_role ->
              Map.merge(co_role, parsed_role)
          end

        [merged_role | acc]
      end)

    # Keep roles that exist in CSV but not in en_GB.json (e.g. newer experimental roles).
    extra_roles_from_csv =
      parsed_roles_from_csv
      |> Enum.reject(fn {role_id, _role} -> Map.has_key?(co_roles, role_id) end)
      |> Enum.map(fn {_role_id, role} -> role end)

    merged_roles =
      merged_with_all_co_roles
      |> Kernel.++(extra_roles_from_csv)
      |> Enum.map(&normalize_icon_path/1)

    result_json = Jason.encode!(merged_roles)

    json_path = "assets/json/#{locale}.json"
    File.write!(json_path, result_json)

    Logger.info("File generated at: #{json_path}\n")
  end

  @doc """
  Take a row from the csv and transform it into a clocktower.online formatted role. There isn't much to do here actually, except transform comma separated arrays (e.g. "Drunk 3,Drunk 2,Drunk 1,No ability") into actual lists.
  """
  def from_csv_row_to_co_role(
        %{
          "reminders" => reminders,
          "remindersGlobal" => reminders_global,
          "firstNight" => first_night,
          "otherNight" => other_night
        } = row
      ) do
    parsed_reminders = from_comma_separated_array_to_list(reminders)
    parsed_reminders_global = from_comma_separated_array_to_mapset(reminders_global)

    # Convert night order strings to integers
    parsed_first_night = parse_night_order(first_night)
    parsed_other_night = parse_night_order(other_night)

    # Overwrite reminders and remindersGlobal with the parsed list, and night orders with integers
    %{
      row
      | "reminders" => parsed_reminders,
        "remindersGlobal" => MapSet.to_list(parsed_reminders_global),
        "firstNight" => parsed_first_night,
        "otherNight" => parsed_other_night
    }
  end

  # For reminders, we keep duplicates by using a list instead of a MapSet
  defp from_comma_separated_array_to_list(comma_separated_array) do
    case comma_separated_array do
      "" ->
        []

      comma_separated_array ->
        comma_separated_array
        |> String.split(",")
        |> Enum.map(&String.trim/1)
    end
  end

  # For remindersGlobal, we still use MapSet to deduplicate
  defp from_comma_separated_array_to_mapset(comma_separated_array) do
    case comma_separated_array do
      "" ->
        MapSet.new()

      comma_separated_array ->
        comma_separated_array
        |> String.split(",")
        |> Enum.map(&String.trim(&1))
        |> Enum.into(MapSet.new())
    end
  end

  # Convert night order string to integer
  defp parse_night_order(night_order) when is_binary(night_order) do
    case Integer.parse(night_order) do
      {number, _} -> number
      :error -> nil
    end
  end
  defp parse_night_order(_), do: nil

  defp normalize_icon_path(%{"id" => role_id} = role) when is_binary(role_id) do
    image = Map.get(role, "image", "")

    should_normalize =
      cond do
        image == "" ->
          true

        is_binary(image) ->
          String.starts_with?(image, "../../assets/icons/Icon_") or
            String.starts_with?(
              image,
              "https://github.com/wonhyo-e/botc-translations/blob/main/assets/icons/Icon_"
            ) or
            String.starts_with?(
              image,
              "https://github.com/botc-kr/botc-kr.github.io/blob/main/public/translations/assets/icons/Icon_"
            )

        true ->
          false
      end

    if should_normalize do
      Map.put(
        role,
        "image",
        "https://github.com/botc-kr/botc-kr.github.io/blob/main/src/assets/icons/Icon_#{role_id}.png?raw=true"
      )
    else
      role
    end
  end

  defp normalize_icon_path(role), do: role
end

# Process only ko_KR locale
locale = "ko_KR"
path = "assets/csv/#{locale}.csv"
GenerateJsonFromCsv.process_csv(path)
