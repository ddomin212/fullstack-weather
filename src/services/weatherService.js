import formatCurrentWeather from "../utils/parsingUtils";
import { BACKEND_URL } from "../utils/settings";

/**
 * Fetches weather data from the server.
 * @param {string} infoType - The type of information to fetch (either "city" or "coordinates").
 * @param {Object} searchParams - The search parameters to include in the request URL.
 * @returns {Promise<Object>} - A Promise that resolves to the weather data as an object.
 */
const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BACKEND_URL + "/weather/" + infoType);
  url.search = new URLSearchParams({ ...searchParams });

  const headers = new Headers();
  headers.append("Host", BACKEND_URL);

  const init = {
    method: "GET",
    headers: headers,
  };

  return fetch(url, init).then((res) => res.json());
};

/**
 * Fetches and formats weather data from the server.
 * @param {Object} searchParams - The search parameters to include in the request URL.
 * @returns {Promise<Object>} - A Promise that resolves to the formatted weather data as an object.
 */
const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    searchParams.city ? "city" : "coordinates",
    searchParams
  ).then(formatCurrentWeather);

  return formattedCurrentWeather;
};

/**
 * Fetches weather data from the server and updates the state.
 * @param {Object} options - The options object.
 * @param {Object} options.query - The query object.
 * @param {string} options.units - The units to use for the weather data.
 * @param {Function} options.setWeather - The function to set the weather data.
 * @returns {Promise<void>} - A Promise that resolves when the weather data is fetched.
 */
const fetchWeather = async ({ query, units, setWeather }) => {
  await getFormattedWeatherData({ ...query, units }).then((data) => {
    setWeather(data);
  });
};

export default fetchWeather;
