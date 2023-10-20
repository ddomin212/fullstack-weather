import {
  formatHourlyWeather,
  getDailyIcon,
  getDailyMax,
  formatCurrentWeather,
} from "../parsingUtils";

describe("parsingUtils", () => {
  describe("formatHourlyWeather", () => {
    it("should format hourly weather object with local time and weather icon", () => {
      const hour = {
        dt: 1629788400,
        weather_icon: "01d",
        temp: 25,
        humidity: 50,
        wind_speed: 10,
      };
      const timezone = 3600;
      const formattedHour = formatHourlyWeather(hour, timezone);
      expect(formattedHour.title).toEqual("08:00");
      expect(formattedHour.icon).toEqual("01d");
      expect(formattedHour.temp).toEqual(25);
      expect(formattedHour.humidity).toEqual(50);
      expect(formattedHour.wind_speed).toEqual(10);
    });
  });

  describe("getDailyIcon", () => {
    it("should set the daily icon based on the most frequent weather icon", () => {
      const item = {
        icons: {
          "01d": 2,
          "02d": 1,
          "03d": 3,
        },
      };
      const icon = "icon";
      getDailyIcon(item, icon);
      expect(item.icon).toEqual("03d");
    });

    // it("should set the daily icon to the only weather icon if there is only one", () => {
    //   const item = {
    //     icons: {
    //       "01d": 1,
    //     },
    //   };
    //   const icon = "icon";
    //   getDailyIcon(item, icon);
    //   expect(item.icon).toEqual("01d");
    // });

    // it("should set the daily icon to '01d' if there are no weather icons", () => {
    //   const item = {
    //     icons: {},
    //   };
    //   const icon = "icon";
    //   getDailyIcon(item, icon);
    //   expect(item.icon).toEqual("01d");
    // });
  });
});

describe("parsingUtils", () => {
  describe("getDailyMax", () => {
    it("should update the accumulator object with daily max values", () => {
      const acc = {};
      const obj = {
        dt: 1629788400,
        temp: 25,
        pressure: 1000,
        humidity: 50,
        wind_speed: 10,
        clouds: 20,
        rain: 0,
        rain_prob: 0,
        weather_icon: "01d",
      };
      const timezone = 3600;
      const updatedAcc = getDailyMax(acc, obj, timezone);
      expect(updatedAcc).toEqual({
        Tue: {
          title: "Tue",
          temp: 25,
          pressure: 1000,
          humidity: 50,
          wind_speed: 10,
          clouds: 20,
          rain: 0,
          rain_prob: 0,
          icons: { "01d": 1 },
          icon: "01d",
        },
      });
    });
  });

  describe("formatCurrentWeather", () => {
    it("should format the current weather data with hourly and daily forecasts", () => {
      const data = {
        weather: {
          description: "clear sky",
          icon: "01d",
          temperature: 25,
          feels_like: 28,
          pressure: 1000,
          humidity: 50,
          wind_speed: 10,
          timezone: 3600,
          clouds: 0,
          rain: 0,
          rain_prob: 0,
        },
        units: {
          speed: "km/h",
          pressure: "hPa",
          distance: "km",
        },
        forecast: {
          name: "New York",
          country: "US",
          forecasts: [
            {
              dt: 1629788400,
              temp: 25,
              pressure: 1000,
              humidity: 50,
              wind_speed: 10,
              weather_icon: "01d",
              clouds: 0,
              rain: 0,
              rain_prob: 0,
            },
          ],
        },
        air_quality: {
          "2000-05-16": [60, 80, 2, 6, 5],
        },
        historical: [
          {
            dt: 1629788400,
            temp: 25,
            pressure: 1000,
            humidity: 50,
            wind_speed: 10,
            weather_icon: "01d",
          },
        ],
      };

      const formattedData = formatCurrentWeather(data);

      expect(formattedData).toEqual({
        description: "clear sky",
        icon: "01d",
        temperature: 25,
        feels_like: 28,
        pressure: 1000,
        humidity: 50,
        timezone: 3600,
        wind_speed: 10,
        units: { speed: "km/h", pressure: "hPa", distance: "km" },
        name: "New York",
        country: "US",
        clouds: 0,
        rain: 0,
        rain_prob: 0,
        hourly: [
          {
            title: "08:00",
            icon: "01d",
            temp: 25,
            pressure: 1000,
            humidity: 50,
            wind_speed: 10,
            clouds: 0,
            rain: 0,
            rain_prob: 0,
          },
        ],
        daily: {
          Tue: {
            title: "Tue",
            temp: 25,
            pressure: 1000,
            humidity: 50,
            wind_speed: 10,
            clouds: 0,
            rain: 0,
            rain_prob: 0,
            icons: { "01d": 1 },
            icon: "01d",
          },
        },
        historical: [
          {
            dt: 1629788400,
            temp: 25,
            pressure: 1000,
            humidity: 50,
            wind_speed: 10,
            weather_icon: "01d",
          },
        ],
        air_quality: { "2000-05-16": [60, 80, 2, 6, 5] },
      });

      expect(formattedData.hourly.length).toEqual(1);
      expect(formattedData.daily.Tue);
    });
  });
});
