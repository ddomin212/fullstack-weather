import unittest

from fastapi import HTTPException
from requests.exceptions import HTTPError
from utils.errors import handle_exception, handle_pyrebase


class TestErrors(unittest.TestCase):
    def test_handle_exception(self):
        @handle_exception
        def test_func():
            raise ValueError("Test error")

        with self.assertRaises(HTTPException) as cm:
            test_func()

        self.assertEqual(cm.exception.status_code, 400)
        self.assertEqual(cm.exception.detail, "Missing request data or parameters")

    def test_http_error(self):
        def test_func():
            raise HTTPError("403 Client Error: Forbidden for url: https://test.com")

        with self.assertRaises(HTTPError) as cm:
            handle_pyrebase(test_func())

    def test_handle_pyrebase(self):
        def test_func():
            raise HTTPError(
                """[Errno 400 Client Error: Bad Request for url: https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=AIzaSyAjRtHES5VJEZ-3gcGXdnO9bFHraNZA5kU] {
                    "error": {
                        "code": 400,
                        "message": "INVALID_ID_TOKEN",
                        "errors": [
                        {
                            "message": "INVALID_ID_TOKEN",
                            "domain": "global",
                            "reason": "invalid"
                        }
                        ]
                    }
                    }"""
            )

        try:
            test_func()
        except Exception as e:
            response = handle_pyrebase(e)
            self.assertEqual(response[1], 400)
            self.assertEqual(response[0], {"error": "INVALID_ID_TOKEN"})


if __name__ == "__main__":
    unittest.main()
