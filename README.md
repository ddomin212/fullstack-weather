# Weather App

This is a simple weather application built with FastAPI and React.

## Features

- Users can search for weather information by city name or geo-location
- Users can view current weather conditions and a 5-day forecast, along with sunrise and sunset times
- Paid users can view additional weather information, including air quality and historical weather
- Users can view weather information in both Celsius and Fahrenheit

## Installation

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

## Usage

1. Open the app in your browser at `http://localhost:3000`
2. Enter a city name in the search bar and press enter, optionally click the geo-location button to search for your current location
3. Enjoy the weather!

## Contributing

Contributions are welcome! Please open an issue or pull request if you find a bug or have a feature request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
