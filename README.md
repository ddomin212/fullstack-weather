# Weather App

This is a simple weather application built with FastAPI and React.

## Features

- Users can search for weather information by city name or geo-location
- Users can view current weather conditions and a 5-day forecast, along with sunrise and sunset times
- Paid users can view additional weather information, including air quality and historical weather
- Users can view weather information in both Celsius and Fahrenheit

## Installation
Have your own enviroment variables ready, otherwise, the **project WILL NOT load**. What you need is:
1. GCP Account and Service Account JSON
2. Redis database (loacl or cloud)
3. OpenMeteo API key
4. Stripe API key
5. Sentry API Key

The process is as follows
1. Clone the repository
2. Install the required dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```
   uvicorn main:app --reload --bind 0.0.0.0
   ```
4. Install the required dependencies for the React app:
   ```
   cd frontend
   npm install
   ```
5. Start the React app:
   ```
   npm start --host 0.0.0.0
   ```

## Documentation

### JSDoc

We use JSDoc for documenting our JavaScript code. You can find it [here](https://ddomin212.github.io/fullstack-weather/frontend/out/index.html)

### Test Coverage

We use Jest and Pytest for testing and coverage reports. Links can be found [here](https://ddomin212.github.io/fullstack-weather/backend/cov) and [here](https://ddomin212.github.io/fullstack-weather/frontend/coverage/lcov-report/index.html)

### Linter Reports

We use ESLint for linting our JavaScript code. To view the linter report head [here](https://ddomin212.github.io/fullstack-weather/frontend/report.html)

This will lint your code and output any issues to the console.

## Usage

1. Open the app in your browser at `http://localhost:3000`
2. Enter a city name in the search bar and press enter, optionally click the geo-location button to search for your current location
3. Enjoy the weather!

## Contributing

Contributions are welcome! Please open an issue or pull request if you find a bug or have a feature request.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details.
