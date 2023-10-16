const STATS = [
  "temp",
  "pressure",
  "humidity",
  "wind_speed",
  "clouds",
  "rain",
  "rain_prob",
];
const TIME_INTERVALS = ["24h", "48h", "all_time"];
const BACKEND_URL = "http://192.168.50.47:8000";
const AIR_QUALITY_METRICS = ["AQI", "PM2.5", "PM10", "O3", "NO2", "SO2"];

export { STATS, TIME_INTERVALS, BACKEND_URL, AIR_QUALITY_METRICS };
