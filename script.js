const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherBody = document.getElementById('weather-body');
const errorMsg = document.getElementById('error-msg');
const loadingMsg = document.getElementById('loading-msg');

const tempElement = document.getElementById('temp');
const conditionElement = document.getElementById('condition');
const cityDisplayElement = document.getElementById('city-display');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const weatherIconElement = document.getElementById('weather-icon');

const API_KEY = "6e8d0e95881c45dd9ca65113262301";

async function checkWeather(city) {
    // Reset UI
    loadingMsg.style.display = "block";
    weatherBody.style.display = "none";
    errorMsg.style.display = "none";

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        // Update UI with Data
        tempElement.innerHTML = `${Math.round(data.current.temp_c)}<sup>°C</sup>`;
        conditionElement.innerText = data.current.condition.text;
        cityDisplayElement.innerText = `${data.location.name}, ${data.location.country}`;
        humidityElement.innerText = `${data.current.humidity}%`;
        windSpeedElement.innerText = `${data.current.wind_kph} km/h`;
        weatherIconElement.src = `https:${data.current.condition.icon}`;

        // Show Weather Body
        loadingMsg.style.display = "none";
        weatherBody.style.display = "flex"; // Changed to match CSS (initially none, but flex is good for column layout)

    } catch (error) {
        loadingMsg.style.display = "none";
        errorMsg.style.display = "block";
        console.error(error);
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});

// Initial check for a default city
checkWeather("Pune");
