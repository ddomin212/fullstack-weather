import { formatToLocalTime } from "./timeUtils";
import { STATS } from "./settings";

/**
 * Formats an hourly weather object to include the local time and weather icon.
 * @param {Object} obj - The hourly weather object.
 * @param {string} timezone - The timezone for the weather data.
 * @returns {Object} - The formatted hourly weather object.
 */
const formatHourlyWeather = (hour, timezone) => {
  const obj = {};

  STATS.map((stat) => {
    obj[stat] = hour[stat];
  });

  return {
    title: formatToLocalTime(hour.dt, timezone, "HH:mm"),
    icon: hour.weather_icon,
    ...obj,
  };
};

const getDailyIcon = (item, icon) => {
  if (!item.icons[icon]) {
    item.icons[icon] = 1;
  } else {
    item.icons[icon]++;
  }

  item.icon = Object.entries(item.icons).sort((a, b) => b[1] - a[1])[0][0];
};

/**
 * Gets the maximum value for each weather statistic for a given day.
 * @param {Object} acc - The accumulator object.
 * @param {Object} obj - The current forecast object.
 * @param {string} timezone - The timezone for the weather data.
 * @returns {Object} - The updated accumulator object.
 */
const getDailyMax = (acc, obj, timezone) => {
  const key = formatToLocalTime(obj.dt, timezone, "EEE");
  if (!acc[key]) {
    acc[key] = {
      title: key,
      temp: 0,
      pressure: 0,
      humidity: 0,
      wind_speed: 0,
      clouds: 0,
      rain: 0,
      rain_prob: 0,
      icons: {},
      icon: "",
    };
  }

  STATS.map((stat) => {
    acc[key][stat] = obj[stat] > acc[key][stat] ? obj[stat] : acc[key][stat];
  });

  getDailyIcon(acc[key], obj.weather_icon);

  return acc;
};

/**
 * Formats the current weather data to include hourly and daily forecasts.
 * @param {Object} data - The weather data to format.
 * @returns {Object} - The formatted weather data.
 */
const formatCurrentWeather = (data) => {
  const { weather, units, air_quality, historical } = data;

  let {
    forecast: { name, country, forecasts },
  } = data;

  let hourly = forecasts.map((hour) =>
    formatHourlyWeather(hour, weather.timezone)
  );

  let daily = forecasts.reduce(
    (acc, obj) => getDailyMax(acc, obj, weather.timezone),
    {}
  );

  return Object.assign({}, weather, {
    units,
    name,
    country,
    hourly,
    daily,
    historical,
    air_quality,
  });
};

const getCSRFToken = () => {
  const csrfToken = document.cookie.match(/csrftoken=(.*)/)[1];
  return csrfToken;
};

export default formatCurrentWeather;

/**
 * Converts a weather icon code to a URL.
 * @param {string} code - icon code.
 * @returns {string} - icon URL.
 */
const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export { iconUrlFromCode, getCSRFToken };
