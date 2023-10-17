def parse_query(params: dict[str, float | str]) -> str:
    """Convert a dict of query params to a string that can be used in a URL

    Args:
        params: Query params for the API call

    Returns:
        str: Query params as a string
    """
    return "&".join([f"{key}={value}" for key, value in params.items()])
