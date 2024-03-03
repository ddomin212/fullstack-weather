import formatCurrentWeather, { getCSRFToken } from "../utils/parsingUtils";
import { BACKEND_URL } from "../utils/settings";
import urlParse from "url-parse";

/**
 * Fetches weather data from the server.
 * @param {string} infoType - The type of information to fetch (either "city" or "coordinates").
 * @param {Object} searchParams - The search parameters to include in the request URL.
 * @param {string} token - The user's token.
 * @param {string} refreshToken - The user's refresh token.
 * @returns {Promise<Object>} - A Promise that resolves to the weather data as an object.
 */
const getWeatherData = (infoType, searchParams, token, refreshToken) => {
  const url = urlParse(BACKEND_URL + "/weather/" + infoType, true);
  url.query = { ...searchParams };

  const headers = new Headers();
  headers.append("Host", process.env.REACT_APP_SECRET_HOST_HEADER);
  headers.append("X-CSRF-Token", getCSRFToken());
  headers.append("Content-Type", "application/json");

  const init = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ token, refreshToken }),
  };

  return fetch(url.toString(), init).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error("Error fetching weather data.");
    }
  });
};

/**
 * Fetches and formats weather data from the server.
 * @param {Object} searchParams - The search parameters to include in the request URL.
 * @param {string} token - The user's token.
 * @param {string} refreshToken - The user's refresh token.
 * @returns {Promise<Object>} - A Promise that resolves to the formatted weather data as an object.
 */
const getFormattedWeatherData = async (searchParams, token, refreshToken) => {
  const formattedCurrentWeather = await getWeatherData(
    searchParams.city ? "city" : "coordinates",
    searchParams,
    token,
    refreshToken
  )
    .then(formatCurrentWeather)
    .catch((err) => {
      throw new Error("Error fetching weather data.");
    });

  return formattedCurrentWeather;
};

/**
 * Fetches weather data from the server and updates the state.
 * @param {Object} options - The options object.
 * @param {Object} options.query - The query object.
 * @param {string} options.units - The units to use for the weather data.
 * @param {Function} options.setWeather - The function to set the weather data.
 * @param {string} options.token - The user's token.
 * @param {string} options.refreshToken - The user's refresh token.
 * @returns {Promise<void>} - A Promise that resolves when the weather data is fetched.
 */
const fetchWeather = async ({
  query,
  units,
  setWeather,
  token,
  refreshToken,
}) => {
  await getFormattedWeatherData({ ...query, units }, token, refreshToken)
    .then((data) => {
      setWeather(data);
    })
    .catch((err) => {
      throw new Error("Error fetching weather data.");
    });
};

export default fetchWeather;

export { getWeatherData, getFormattedWeatherData };
