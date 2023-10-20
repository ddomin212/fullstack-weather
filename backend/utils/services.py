def parse_query(params: dict[str, float | str]) -> str:
    """Convert a dict of query params to a string that can be used in a URL

    Args:
        params: Query params for the API call

    Returns:
        str: Query params as a string
    """
    return "&".join([f"{key}={value}" for key, value in params.items()])

def units_appendix(units: str) -> str:
    """Append units to the URL for the API call according to query

    Args:
        units: units of measurement, can be metric or imperial. Defaults to "metric".

    Returns:
        str: units of measurement for the API call
    """
    return (
        "&temperature_unit=fahrenheit&windspeed_unit=mph"
        if units == "imperial"
        else "&windspeed_unit=ms"
    )