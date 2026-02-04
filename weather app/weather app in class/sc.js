const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const bgLayer = document.getElementById("bg-layer");

// Elements to update
const mainCity = document.getElementById("main-city");
const mainTemp = document.getElementById("main-temp");
const mainCondition = document.getElementById("main-condition");
const hourlyContainer = document.getElementById("hourly-container");
const dailyContainer = document.getElementById("forecast-daily-container");

// Card Elements
const aqiScore = document.getElementById("aqi-score");
const aqiText = document.getElementById("aqi-text");
const windSpeed = document.getElementById("wind-speed");
const gustSpeed = document.getElementById("gust-speed");
const windDir = document.getElementById("wind-dir");
const compassVal = document.getElementById("compass-val");
const windNeedle = document.getElementById("wind-needle");
const uvVal = document.getElementById("uv-val");
const uvText = document.getElementById("uv-text");
const uvFill = document.getElementById("uv-fill");
const sunsetTime = document.getElementById("sunset-time");
const sunriseTime = document.getElementById("sunrise-time");
const feelsLike = document.getElementById("feels-like");
const precipVal = document.getElementById("precip-val");
const humidityVal = document.getElementById("humidity-val");
const dewPoint = document.getElementById("dew-point");
const visVal = document.getElementById("vis-val");
const pressureVal = document.getElementById("pressure-val");
const sidebarLoc = document.getElementById("sidebar-loc");
const sidebarTemp = document.getElementById("sidebar-temp");

// Event Listeners
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const location = searchInput.value.trim();
    if (location) fetchWeather(location);
    searchInput.value = "";
  }
});

// Default load
window.addEventListener("DOMContentLoaded", () => {
  fetchWeather("Pimpri Chinchwad");
});

async function fetchWeather(city) {
  try {
    const key = "6e8d0e95881c45dd9ca65113262301";
    // Fetch 3 days forecast (Free tier limit usually)
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=3&aqi=yes&alerts=no`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    updateDOM(data);
  } catch (error) {
    console.error(error);
    alert("Error fetching weather data. Please try again.");
  }
}

function updateDOM(data) {
  const current = data.current;
  const location = data.location;
  const forecast = data.forecast.forecastday;

  // --- Main Header ---
  mainCity.textContent = location.name;
  mainTemp.textContent = Math.round(current.temp_c) + "°";
  mainCondition.textContent = current.condition.text;

  // Sidebar sync
  sidebarLoc.textContent = location.name;
  sidebarTemp.textContent = Math.round(current.temp_c) + "°";

  // --- Background Logic ---
  updateBackground(current.condition.text, current.is_day);

  // --- Hourly Forecast ---
  // API returns hours for each day. We want the next 24h or just remaining hours of today.
  // Let's take the hours from today that are >= current hour.
  const currentHourEpoch = current.last_updated_epoch;
  let nextHours = [];

  // Flatten hours from today and tomorrow
  const allHours = [...forecast[0].hour, ...forecast[1].hour];

  // Filter for future hours (custom logic to match epoch relatively close)
  // Simplified: show hours from current index
  const currentHour = new Date(location.localtime).getHours();

  // Start from current hour today
  let hoursToShow = forecast[0].hour.slice(currentHour);
  // Add some from tomorrow to fill up
  if (hoursToShow.length < 24) {
    hoursToShow = [...hoursToShow, ...forecast[1].hour.slice(0, 24 - hoursToShow.length)];
  }

  hourlyContainer.innerHTML = "";
  hoursToShow.forEach(hour => {
    const time = hour.time.split(" ")[1]; // "2023-01-01 13:00" -> "13:00"
    const el = document.createElement("div");
    el.className = "hourly-item";
    el.innerHTML = `
        <span class="h-time">${time}</span>
        <div class="h-icon"><img src="${hour.condition.icon}" alt="weather"></div>
        <span class="h-temp">${Math.round(hour.temp_c)}°</span>
      `;
    hourlyContainer.appendChild(el);
  });

  // --- Daily Forecast ---
  dailyContainer.innerHTML = "";
  forecast.forEach(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
    // If it's today, say "Today"
    const isToday = day.date === location.localtime.split(" ")[0];
    const displayName = isToday ? "Today" : dayName;

    const el = document.createElement("div");
    el.className = "daily-item";

    // Calculate bar width/position based on some range (0 to 40 for example)
    // Visual mock only for width
    const min = Math.round(day.day.mintemp_c);
    const max = Math.round(day.day.maxtemp_c);

    el.innerHTML = `
        <span class="d-day">${displayName}</span>
        <div class="d-icon"><img src="${day.day.condition.icon}" alt="weather"></div>
        <div class="d-temp-range">
            <span class="d-low">${min}°</span>
            <div class="d-bar">
                <div class="d-bar-fill"></div> 
            </div>
            <span class="d-high">${max}°</span>
        </div>
      `;
    dailyContainer.appendChild(el);
  });

  // --- Grid Widgets ---

  // AQI
  if (current.air_quality) {
    const aqi = current.air_quality['us-epa-index'];
    // 1-6 scale usually
    const aqiLabels = { 1: "Good", 2: "Moderate", 3: "Unhealthy for Sensitive", 4: "Unhealthy", 5: "Very Unhealthy", 6: "Hazardous" };
    aqiScore.textContent = aqi;
    aqiText.textContent = aqiLabels[aqi] || "Moderate";
    // Update bar width (aqi / 6 * 100)
    document.querySelector(".aqi-fill").style.width = (aqi / 6 * 100) + "%";
  }

  // Wind
  windSpeed.textContent = current.wind_kph + " kph";
  gustSpeed.textContent = current.gust_kph + " kph";
  windDir.textContent = `${current.wind_degree}° ${current.wind_dir}`;
  compassVal.textContent = Math.round(current.wind_kph);
  windNeedle.style.transform = `translateX(-50%) rotate(${current.wind_degree}deg)`; // Adjust rotation logic

  // UV
  uvVal.textContent = current.uv;
  let uvDesc = "Low";
  if (current.uv > 2) uvDesc = "Moderate";
  if (current.uv > 5) uvDesc = "High";
  if (current.uv > 7) uvDesc = "Very High";
  if (current.uv > 10) uvDesc = "Extreme";
  uvText.textContent = uvDesc;
  uvFill.style.width = (current.uv / 11 * 100) + "%";

  // Astro
  const astro = forecast[0].astro;
  sunsetTime.textContent = astro.sunset;
  sunriseTime.textContent = astro.sunrise;

  // Feels Like
  feelsLike.textContent = Math.round(current.feelslike_c) + "°";

  // Precip
  precipVal.textContent = current.precip_mm + " mm";

  // Humidity
  humidityVal.textContent = current.humidity + "%";
  // Dew point approximation: T - ((100 - RH)/5)
  const dp = current.temp_c - ((100 - current.humidity) / 5);
  dewPoint.textContent = Math.round(dp) + "°";

  // Visibility
  visVal.textContent = current.vis_km + " km";

  // Pressure
  pressureVal.textContent = current.pressure_mb;

}

function updateBackground(conditionText, isDay) {
  const text = conditionText.toLowerCase();
  const bg = bgLayer;

  // Remove all classes
  bg.className = "bg-layer"; // Reset

  if (isDay === 0) {
    bg.classList.add("weather-night");
    return;
  }

  if (text.includes("sunny") || text.includes("clear")) {
    bg.classList.add("weather-sunny");
  } else if (text.includes("rain") || text.includes("drizzle") || text.includes("mist")) {
    bg.classList.add("weather-rain");
  } else if (text.includes("cloud") || text.includes("overcast")) {
    bg.classList.add("weather-cloudy");
  } else {
    bg.classList.add("weather-sunny"); // Default
  }
}
