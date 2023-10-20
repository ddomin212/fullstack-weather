import unittest

from utils.services import parse_query, units_appendix


class TestServices(unittest.TestCase):
    def test_parse_query(self):
        params = {"q": "London,UK", "appid": "1234567890"}

        query_string = parse_query(params)

        self.assertEqual(query_string, "q=London,UK&appid=1234567890")

    def test_units_appendix(self):
        units_metric = units_appendix("metric")
        units_imperial = units_appendix("imperial")

        self.assertEqual(units_metric, "&windspeed_unit=ms")
        self.assertEqual(
            units_imperial, "&temperature_unit=fahrenheit&windspeed_unit=mph"
        )


if __name__ == "__main__":
    unittest.main()
