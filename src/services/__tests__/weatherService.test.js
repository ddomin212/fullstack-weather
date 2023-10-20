import { getWeatherData } from "../weatherService";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

describe("getWeatherData", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should make a POST request to the weather endpoint with the user's token and refresh token", async () => {
    const searchParams = { city: "Tokio" };
    const token = "abc123";
    const refreshToken = "def456";
    fetch.mockResponseOnce(JSON.stringify({ weather: {} }), {
      status: 200,
    });

    const headers = new Headers();
    headers.append("Host", "hostname");
    headers.append("X-CSRF-Token", "test");
    headers.append("Content-Type", "application/json");

    await getWeatherData("city", searchParams, token, refreshToken);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      "http://192.168.50.47:8000/weather/city?city=Tokio"
    );
    expect(fetch.mock.calls[0][1].method).toEqual("POST");
    expect(fetch.mock.calls[0][1].headers).toEqual(headers);
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({ token: "abc123", refreshToken: "def456" })
    );
  });

  it("should return the weather data as an object if the request is successful", async () => {
    const searchParams = { city: "New York" };
    const token = "abc123";
    const refreshToken = "def456";
    fetch.mockResponseOnce(JSON.stringify({ temperature: 72 }));

    const result = await getWeatherData(
      "city",
      searchParams,
      token,
      refreshToken
    );

    expect(result).toEqual({ temperature: 72 });
  });

  it("should throw an error if the request fails", async () => {
    const searchParams = { city: "New York" };
    const token = "abc123";
    const refreshToken = "def456";
    fetch.mockResponseOnce(JSON.stringify({ status_code: 500 }), {
      status: 500,
    });

    await expect(
      getWeatherData("city", searchParams, token, refreshToken)
    ).rejects.toThrow("Error fetching weather data.");
  });
});
