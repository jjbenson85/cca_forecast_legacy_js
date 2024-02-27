export type WeatherData = {
  date_time: string;
  average_temperature: number;
  probability_of_rain: number;
};

const loadWeatherData = async () => {
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
};

function handleData(weatherData: WeatherData[]) {
  const groupedData = weatherData.reduce((acc, entry) => {
    const entryDate = new Date(entry.date_time);
    const dayKey = entryDate.toISOString().split("T")[0];
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(entry);
    return acc;
  }, {} as { [key: string]: WeatherData[] });

  const container = document.getElementById("forecast-summaries")!;

  Object.entries(groupedData).forEach(([day, entries]) => {
    const allTemps = entries.map((entry) => entry.average_temperature);
    const morningEntries = entries.filter((entry) => {
      const hour = new Date(entry.date_time).getHours();
      return hour >= 6 && hour < 12;
    });
    const afternoonEntries = entries.filter((entry) => {
      const hour = new Date(entry.date_time).getHours();
      return hour >= 12 && hour < 18;
    });

    const morningTemps = morningEntries.map(
      (entry) => entry.average_temperature
    );
    const morningRains = morningEntries.map(
      (entry) => entry.probability_of_rain
    );
    const afternoonTemps = afternoonEntries.map(
      (entry) => entry.average_temperature
    );
    const afternoonRains = afternoonEntries.map(
      (entry) => entry.probability_of_rain
    );

    const summaryElement = document.createElement("div");
    summaryElement.innerHTML = `
                <h3>Day: ${new Date(day).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}</h3>
                <p>Morning Average Temperature: ${
                  morningTemps.length
                    ? (
                        morningTemps.reduce((a, b) => a + b, 0) /
                        morningTemps.length
                      ).toFixed(2)
                    : "Insufficient forecast data"
                }</p>
                <p>Morning Chance Of Rain: ${
                  morningRains.length
                    ? (
                        morningRains.reduce((a, b) => a + b, 0) /
                        morningRains.length
                      ).toFixed(2) + "%"
                    : "Insufficient forecast data"
                }</p>
                <p>Afternoon Average Temperature: ${
                  afternoonTemps.length
                    ? (
                        afternoonTemps.reduce((a, b) => a + b, 0) /
                        afternoonTemps.length
                      ).toFixed(2)
                    : "Insufficient forecast data"
                }</p>
                <p>Afternoon Chance Of Rain: ${
                  afternoonRains.length
                    ? (
                        afternoonRains.reduce((a, b) => a + b, 0) /
                        afternoonRains.length
                      ).toFixed(2) + "%"
                    : "Insufficient forecast data"
                }</p>
                <p>High Temperature: ${Math.max(...allTemps)}</p>
                <p>Low Temperature: ${Math.min(...allTemps)}</p>
            `;
    container.appendChild(summaryElement);
  });
}

export async function main() {
  const data = await loadWeatherData();
  handleData(data);
}

document.addEventListener("DOMContentLoaded", main);
