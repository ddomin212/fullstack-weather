import re

from fastapi import HTTPException
from requests.exceptions import HTTPError


def handle_pyrebase(e):
    error_string = str(e)
    message_regex = re.compile(r'"message": "([^"]+)"')
    code_regex = re.compile(r'"code": ([^"]+),')
    message = message_regex.search(error_string)
    code = code_regex.search(error_string)

    if message and code:
        message = message.group(1)
        code = code.group(1).strip()
    else:
        raise e

    return {"error": message}, int(code)


def handle_exception(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValueError:
            raise HTTPException(
                detail="Missing request data or parameters", status_code=400
            )
        except TypeError:
            raise HTTPException(
                detail="Invalid request data or parameters", status_code=400
            )
        except Exception as e:
            return {"error": str(e)}, 500

    return wrapper
