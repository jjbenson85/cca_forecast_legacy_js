import { describe, expect, it } from "vitest";
import {
  averageNumArray,
  formatData,
  getAverageTemperature,
  getChanceOfRain,
  getDateFromData,
  isBetweenHours,
  isError,
  isSameDate,
  prettyDate,
  sum,
  sumNumArray,
  unique,
} from "../helpers.js";
import { WeatherData } from "./data.js";

const testWeatherData: WeatherData[] = [
  {
    date_time: "2021-01-01T01:00:00Z",
    average_temperature: 1,
    probability_of_rain: 1,
  },
  {
    date_time: "2021-01-01T02:00:00Z",
    average_temperature: 2,
    probability_of_rain: 2,
  },
  {
    date_time: "2021-01-01T03:00:00Z",
    average_temperature: 3,
    probability_of_rain: 3,
  },
];

describe("sum", function () {
  it("should sum the numbers", () => {
    expect(sum(1, 2)).toEqual(3);
  });
});

describe("sumNumArray", () => {
  it("should sum the numbers in an array", () => {
    expect(sumNumArray([1, 2, 3])).toEqual(6);
  });
});

describe("averageNumArray", () => {
  it("should average the numbers in an array", () => {
    expect(averageNumArray([1, 2, 3])).toEqual(2);
  });

  it("should return an error if the array is empty", () => {
    expect(averageNumArray([])).toEqual(Error("number array is empty"));
  });
});

describe("isError", () => {
  it("should return a value if is not an error", () => {
    expect(isError(1)).toEqual(false);
  });
  it("should return an error if is an error", () => {
    expect(isError(Error("error"))).toEqual(true);
  });
});

describe("getAverageTemperature", () => {
  it("should return the average temperature", () => {
    expect(getAverageTemperature(testWeatherData)).toEqual(2);
  });
  it("should return an error if the array is empty", () => {
    expect(getAverageTemperature([])).toEqual("Insufficient forecast data");
  });
});

describe("getChangeOfRain", () => {
  it("should return the chance of rain", () => {
    expect(getChanceOfRain(testWeatherData)).toEqual(2);
  });
  it("should return an error if the array is empty", () => {
    expect(getChanceOfRain([])).toEqual("Insufficient forecast data");
  });
});

describe("isBetweenHours", () => {
  it("should return a function that checks if a date is between hours", () => {
    const isBetween = isBetweenHours(1, 2);
    if (isError(isBetween)) {
      throw isBetween;
    }

    expect(isBetween(testWeatherData[0])).toEqual(true);
  });

  it("should return an error if start is greater than end", () => {
    expect(isBetweenHours(2, 1)).toEqual(
      Error(`start: 2 is greater than end" 1`)
    );
  });

  it("should return an error if start or end is not between 0 and 24", () => {
    expect(isBetweenHours(-1, 2)).toEqual(
      Error("start and end must be between 0 and 24")
    );
  });
});

describe("formatData", () => {
  it("should format the date", () => {
    expect(formatData("2021-01-01")).toEqual("Friday January 1");
  });
});

describe("getDateFromData", () => {
  it("should return the date from the data", () => {
    expect(getDateFromData(testWeatherData[0])).toEqual("2021-01-01");
  });
});

describe("isSameDate", () => {
  it("should return true if the dates are the same", () => {
    const fn = isSameDate("2021-01-01");
    expect(fn(testWeatherData[0])).toEqual(true);
  });
  it("should return false if the dates are the different", () => {
    const fn = isSameDate("2021-01-02");
    expect(fn(testWeatherData[0])).toEqual(false);
  });
});

describe("unique", () => {
  it("should return an array with unique values", () => {
    expect(unique([1, 1, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });
});

describe("prettyDate", () => {
  it("should format the date", () => {
    expect(prettyDate("2021-01-01")).toEqual("Friday, 1 January");
  });
});
