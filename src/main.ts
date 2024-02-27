import { Summary, summarizeForecast } from "./forecast";
import { prettyDate } from "./helpers";
import { WeatherData } from "./test/data";

async function loadWeatherData() {
  try {
    const url =
      "https://e75urw7oieiszbzws4gevjwvze0baaet.lambda-url.eu-west-2.on.aws/";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as WeatherData[];
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return [];
  }
}

function updateDom(summaryData: Record<string, Summary>) {
  const container = document.getElementById("forecast-summaries");

  if (!container) throw new Error("No forecast-summaries element found");

  Object.entries(summaryData).forEach(([day, summary]) => {
    const summaryElement = document.createElement("div");
    summaryElement.innerHTML = `
                <h3>Day: ${prettyDate(day)}</h3>
                <p>Morning Average Temperature: ${
                  summary.morning_average_temperature
                }</p>
                <p>Morning Chance Of Rain: ${summary.morning_chance_of_rain}</p>
                <p>Afternoon Average Temperature: ${
                  summary.afternoon_average_temperature
                }</p>
                <p>Afternoon Chance Of Rain: ${
                  summary.afternoon_chance_of_rain
                }</p>
                <p>High Temperature: ${summary.high_temperature}</p>
                <p>Low Temperature: ${summary.low_temperature}</p>
            `;
    container.appendChild(summaryElement);
  });
}

export async function main() {
  const data = await loadWeatherData();
  const summaryData = summarizeForecast(data);
  updateDom(summaryData);
}

document.addEventListener("DOMContentLoaded", main);
