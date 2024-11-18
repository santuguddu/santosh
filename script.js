const apiKey = '1f179989032e018b8e14b04a90c06a6e'; 
const forecastEndpoint = 'https://api.openweathermap.org/data/2.5/forecast';

const cityInput = document.getElementById('cityInput');
const searchCityBtn = document.getElementById('searchCityBtn');
const forecastOutput = document.getElementById('forecastOutput');
const forecastCards = document.getElementById('forecastCards');
const errorOutput = document.getElementById('errorOutput');
const recentCitiesDropdown = document.getElementById('recentCitiesDropdown');
const recentCitiesSelect = document.getElementById('recentCities');

let recentSearches = []; // Array to store recent searches

searchCityBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherForecast(city);
        addRecentSearch(city);
    } else {
        displayError('Please enter a city name.');
    }
});

// Event listener for recent cities dropdown
recentCitiesSelect.addEventListener('change', () => {
    const city = recentCitiesSelect.value;
    if (city) {
        fetchWeatherForecast(city);
    }
});

function fetchWeatherForecast(city) {
    const url = `${forecastEndpoint}?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found.');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            displayError(error.message);
        });
}

function displayForecast(data) {
    forecastCards.innerHTML = ''; // Clear previous forecasts
    const forecasts = data.list.filter((_, index) => index % 8 === 0); // Filter forecasts (every 8th item = daily forecast)

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        const temp = `${forecast.main.temp.toFixed(1)}°C`;
        const wind = `Wind: ${forecast.wind.speed} m/s`;
        const humidity = `Humidity: ${forecast.main.humidity}%`;

        const card = `
            <div class="bg-gray-100 p-4 rounded-lg shadow">
                <h4 class="text-gray-700 font-bold">${date}</h4>
                <img src="${icon}" alt="Weather Icon" class="w-16 h-16 mx-auto">
                <p class="text-gray-800">${temp}</p>
                <p class="text-sm text-gray-600">${wind}</p>
                <p class="text-sm text-gray-600">${humidity}</p>
            </div>
        `;
        forecastCards.innerHTML += card;
    });

    // Show the forecast section
    forecastOutput.classList.remove('hidden');
    errorOutput.classList.add('hidden');
}

function displayError(message) {
    errorOutput.textContent = message;
    errorOutput.classList.remove('hidden');
    forecastOutput.classList.add('hidden');
}

function addRecentSearch(city) {
    // Prevent duplicates
    if (!recentSearches.includes(city)) {
        recentSearches.push(city);
        updateRecentCitiesDropdown();
    }
}

function updateRecentCitiesDropdown() {
    recentCitiesSelect.innerHTML = ''; // Clear previous options

    // Add a placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = '-- Select a city --';
    placeholderOption.value = '';
    recentCitiesSelect.appendChild(placeholderOption);

    // Add each recent city as an option
    recentSearches.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentCitiesSelect.appendChild(option);
    });

    // Show the dropdown if there are recent searches
    if (recentSearches.length > 0) {
        recentCitiesDropdown.classList.remove('hidden');
    }
}
function fetchWeatherForecast(city) {
    const url = `${forecastEndpoint}?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Handle specific status codes
                if (response.status === 404) {
                    throw new Error("City not found. Please enter a valid city name.");
                } else if (response.status === 401) {
                    throw new Error("Invalid API key. Please check your API configuration.");
                } else if (response.status === 429) {
                    throw new Error("API request limit reached. Please try again later.");
                } else {
                    throw new Error("An unexpected error occurred. Please try again.");
                }
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            displayError(error.message);
        });
}

function displayError(message) {
    errorOutput.textContent = message;
    errorOutput.classList.remove("hidden");
    forecastOutput.classList.add("hidden"); // Hide the forecast section in case of errors
}

forecastCards.innerHTML = ''; // Clear previous forecasts
const forecasts = data.list.filter((_, index) => index % 8 === 0); // Filter forecasts (every 8th item = daily forecast)

let upperRow = '';
let lowerRow = '';

forecasts.slice(0, 5).forEach((forecast, index) => {
    const date = new Date(forecast.dt_txt).toLocaleDateString("en-US", {
        weekday: "short", 
        month: "short", 
        day: "numeric",
    });
    const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
    const temp = `${forecast.main.temp.toFixed(1)}°C`;
    const wind = `Wind: ${forecast.wind.speed.toFixed(1)} m/s`;
    const humidity = `Humidity: ${forecast.main.humidity}%`;

    const card = `
        <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 max-w-sm">
            <h4 class="text-lg font-semibold text-gray-700 text-center mb-2">${date}</h4>
            <div class="flex justify-center mb-2">
                <img src="${icon}" alt="Weather Icon" class="w-16 h-16 bg-gray-100 p-1 rounded-full shadow">
            </div>
            <p class="text-center text-xl font-bold text-blue-600">${temp}</p>
            <p class="text-sm text-gray-600 text-center mt-1">${wind}</p>
            <p class="text-sm text-gray-600 text-center">${humidity}</p>
        </div>
    `;

    if (index < 3) {
        upperRow += card;
    } else {
        lowerRow += card;
    }
});

// Inject the updated layout
forecastCards.innerHTML = `
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 mb-6">
        ${upperRow}
    </div>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        ${lowerRow}
    </div>
`;

// Show the forecast section
forecastOutput.classList.remove('hidden');
errorOutput.classList.add('hidden');
