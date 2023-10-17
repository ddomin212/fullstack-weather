import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import ChartView from "./components/ChartView";
import fetchWeather from "./services/weatherService";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buyPremium } from "./services/accountService";
import AirQuality from "./components/AirQuality";
import { refreshUserToken } from "./services/authService";
/**
 * The main component of the weather app.
 * @returns {JSX.Element} - The main component of the weather app.
 */
function App() {
  const [query, setQuery] = useState(null);
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [userData, setUserData] = useState({ tier: "" });

  useEffect(() => {
    refreshUserToken({ setUserData }, () => {});
  }, [query, units]);

  useEffect(() => {
    console.log("here");
    if (query) {
      if (userData) {
        fetchWeather({
          query,
          units,
          setWeather,
          token: userData.token,
          refreshToken: userData.refreshToken,
        }).catch((err) => {
          toast.error(err.message);
        });
      } else {
        fetchWeather({
          query,
          units,
          setWeather,
          token: "empty",
        }).catch((err) => {
          toast.error(err.message);
        });
      }
    }
  }, [query, units, userData?.tier]);

  /**
   * Formats the background gradient based on the current weather data.
   * @returns {string} - The CSS class for the background gradient.
   */
  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const hotThreshold = units === "metric" ? 30 : 86;
    const coldThreshold = units === "metric" ? 5 : 41;
    if (weather.temp <= hotThreshold && weather.temp >= coldThreshold) {
      return "from-cyan-700 to-blue-700";
    } else if (weather.temp > hotThreshold) {
      return "from-yellow-700 to-yellow-300";
    } else {
      return "from-blue-300 to-gray-300";
    }
  };

  /**
   * Gets the premium tier for the user.
   * @returns {Promise<void>} - A Promise that resolves when the premium tier is fetched.
   */
  const getPremium = () => buyPremium({ userData, setUserData });

  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-5 md:px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <Inputs
        setQuery={setQuery}
        units={units}
        setUnits={setUnits}
        setUserData={setUserData}
        userData={userData}
      />

      {weather && (
        <div>
          <TimeAndLocation weather={weather} username={userData?.user} />
          <TemperatureAndDetails weather={weather} />

          <Forecast title="hourly forecast" items={weather.hourly} />
          {userData?.tier === "paid" ? (
            <>
              <Forecast
                title="daily forecast"
                items={Object.values(weather.daily).slice(0, 6)}
              />
              <ChartView
                items={weather.hourly}
                daily={Object.values(weather.daily).slice(0, 6)}
                units={weather.units}
                yearly={weather.historical}
              />
              <AirQuality
                airQuality={weather.air_quality}
                timezone={weather.timezone}
                timestamp={weather.dt}
              />
            </>
          ) : (
            <button
              onClick={getPremium}
              class="text-white border border-white rounded-lg py-2 px-4 mt-6 mx-auto transition ease-out hover:scale-110"
            >
              Get premium to see more!
            </button>
          )}
        </div>
      )}

      <ToastContainer autoClose={1500} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;
