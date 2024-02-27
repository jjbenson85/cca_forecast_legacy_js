import { WeatherData } from "./test/data";
import {
  formatData,
  getAverageTemperature,
  getChanceOfRain,
  getDateFromData,
  isBetweenHours,
  isError,
  isSameDate,
  unique,
} from "./helpers";

export type Summary = {
  morning_average_temperature: number | string;
  morning_chance_of_rain: number | string;
  afternoon_average_temperature: number | string;
  afternoon_chance_of_rain: number | string;
  high_temperature: number;
  low_temperature: number;
};

const morningFilter = isBetweenHours(6, 12);
if (isError(morningFilter)) {
  throw morningFilter;
}

const afternoonFilter = isBetweenHours(12, 18);
if (isError(afternoonFilter)) {
  throw afternoonFilter;
}

const createSummary = (items: WeatherData[]) => {
  const morningItems = items.filter(morningFilter);
  const afternoonItems = items.filter(afternoonFilter);

  const tAll = items.map((entry) => entry.average_temperature);

  const summary: Summary = {
    morning_average_temperature: getAverageTemperature(morningItems),
    morning_chance_of_rain: getChanceOfRain(morningItems),
    afternoon_average_temperature: getAverageTemperature(afternoonItems),
    afternoon_chance_of_rain: getChanceOfRain(afternoonItems),
    high_temperature: Math.max(...tAll),
    low_temperature: Math.min(...tAll),
  };

  return summary;
};

export function summarizeForecast(data: WeatherData[]) {
  const uniqueDates = unique(data.map(getDateFromData));
  const summaryEntries = uniqueDates.map((date) => {
    const dateData = data.filter(isSameDate(date));
    return [formatData(date), createSummary(dateData)] as [string, Summary];
  });
  const output: Record<string, Summary> = Object.fromEntries(summaryEntries);
  return output;
}
