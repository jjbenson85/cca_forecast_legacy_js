import { describe, expect, it } from "vitest";
import { summarizeForecast } from "../forecast";
import { weatherData } from "./data";

describe("ForecastTest", function () {
  const summary = summarizeForecast(weatherData);

  it("should correctly calculate morning average temperature", function () {
    expect(summary["Sunday February 18"]["morning_average_temperature"]).toBe(
      10
    );
  });

  it("should correctly calculate morning chance of rain", function () {
    expect(summary["Sunday February 18"]["morning_chance_of_rain"]).toBe(0.14);
  });

  it("should correctly calculate afternoon average temperature", function () {
    expect(summary["Sunday February 18"]["afternoon_average_temperature"]).toBe(
      16
    );
  });

  it("should report the high temperature correctly", function () {
    expect(summary["Sunday February 18"]["high_temperature"]).toBe(17);
  });

  it("should correctly calculate afternoon chance of rain", function () {
    expect(summary["Sunday February 18"]["afternoon_chance_of_rain"]).toBe(0.4);
  });

  it("should report the low temperature correctly", function () {
    expect(summary["Sunday February 18"]["low_temperature"]).toBe(6);
  });

  it('should report "Insufficient forecast data" for morning data when insufficient', function () {
    const testSummary = summarizeForecast([
      {
        date_time: "2024-02-18T00:00:00Z",
        average_temperature: 12,
        probability_of_rain: 0.35,
      },
    ]);
    expect(
      testSummary["Sunday February 18"]["morning_average_temperature"]
    ).toBe("Insufficient forecast data");
  });

  it('should report "Insufficient forecast data" for afternoon data when insufficient', function () {
    const testSummary = summarizeForecast([
      {
        date_time: "2024-02-18T00:00:00Z",
        average_temperature: 12,
        probability_of_rain: 0.35,
      },
    ]);
    expect(
      testSummary["Sunday February 18"]["afternoon_average_temperature"]
    ).toBe("Insufficient forecast data");
  });

  it("should handle multiple days correctly", function () {
    const testSummary = summarizeForecast([
      {
        date_time: "2024-02-18T00:00:00Z",
        average_temperature: 12,
        probability_of_rain: 0.35,
      },
      {
        date_time: "2024-02-19T00:00:00Z",
        average_temperature: 12,
        probability_of_rain: 0.35,
      },
    ]);
    expect(Object.keys(testSummary).length).toBe(2);
  });

  it("should handle no entries correctly", function () {
    const testSummary = summarizeForecast([]);
    expect(Object.keys(testSummary).length).toBe(0);
  });
});
