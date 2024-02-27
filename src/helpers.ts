import { parseISO, format } from "date-fns";
import { WeatherData } from "./test/data";

export const isError = <T>(err: T | Error): err is Error =>
  err instanceof Error;

export const sum = (a: number, b: number) => a + b;

export const sumNumArray = (nums: number[]) => {
  return nums.reduce(sum);
};

export type MaybeError<T> = T | Error;
export const averageNumArray = (nums: number[]): MaybeError<number> => {
  if (nums.length === 0) return Error("number array is empty");

  return sumNumArray(nums) / nums.length;
};

export const getAverageTemperature = (
  items: WeatherData[]
): number | string => {
  const temps = items.map((e) => e.average_temperature);
  const maybeValue = averageNumArray(temps);
  return isError(maybeValue)
    ? "Insufficient forecast data"
    : Math.round(maybeValue);
};

export const getChanceOfRain = (items: WeatherData[]): number | string => {
  const rains = items.map((e) => e.probability_of_rain);
  const maybeValue = averageNumArray(rains);
  return isError(maybeValue)
    ? "Insufficient forecast data"
    : Number(maybeValue.toFixed(2));
};

export const isBetweenHours = (
  start: number,
  end: number
): MaybeError<(data: WeatherData) => boolean> => {
  if (start > end) return Error(`start: ${start} is greater than end" ${end}`);

  if ([start < 0, start > 24, end < 0, end > 24].some((e) => e))
    return Error("start and end must be between 0 and 24");

  return ({ date_time }) => {
    const entryTime = parseISO(date_time);
    const hour = entryTime.getHours();
    return start <= hour && hour < end;
  };
};

export const formatData = (day: string) =>
  format(parseISO(day), "EEEE MMMM dd").replace(" 0", " ");

export const getDateFromData = ({ date_time }: WeatherData) =>
  date_time.split("T")[0];

export const isSameDate = (date: string) => (weatherData: WeatherData) =>
  getDateFromData(weatherData) === date;

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export const prettyDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};
