const apiKey = '93e9722ea069f294426abff327f03f6c';

// Function to fetch weather data
async function getWeatherData(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
  const data = await response.json();
  return data;
}

// Function to display current weather
function displayCurrentWeather(city, date, icon, temperature, humidity, windSpeed) {
  const currentWeather = document.getElementById('currentWeather');
  currentWeather.innerHTML = `
    <h2>${city}</h2>
    <p>Date: ${date}</p>
    <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
    <p>Temperature: ${temperature}</p>
    <p>Humidity: ${humidity}</p>
    <p>Wind Speed: ${windSpeed}</p>
  `;
}

// Function to display forecast
function displayForecast(forecastData, city) {
  const forecast = document.getElementById('forecast');
  forecast.innerHTML = '';
  forecastData.forEach((forecastItem) => {
    const { date, icon, temperature, humidity, windSpeed } = forecastItem;
    const forecastItemElement = document.createElement('div');
    forecastItemElement.classList.add('forecast-item');
    forecastItemElement.innerHTML = `
        <p>City: ${city}</p>
        <p>Date: ${date}</p>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature}</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind Speed: ${windSpeed}</p>
    `;
    forecast.appendChild(forecastItemElement);
  });
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value.trim();
  if (city !== '') {
    getWeatherData(city)
      .then((data) => {
        const { city, list } = data;
        const currentWeather = list[0];
        const forecast = list.slice(1);
        const date = currentWeather.dt_txt;
        const icon = currentWeather.weather[0].icon;
        const temperature = currentWeather.main.temp;
        const humidity = currentWeather.main.humidity;
        const windSpeed = currentWeather.wind.speed;
        displayCurrentWeather(city, date, icon, temperature, humidity, windSpeed);
        displayForecast(forecast.map((item) => ({
          date: item.dt_txt,
          icon: item.weather[0].icon,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        })));
        addToSearchHistory(city);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while fetching weather data. Please try again.');
      });
  } else {
    alert('Please enter a valid city.');
  }
  cityInput.value = '';
}

// Function to add city to search history
function addToSearchHistory(city) {
  const searchHistory = document.getElementById('searchHistory');
  const cityElement = document.createElement('button');
  cityElement.textContent = city.name;
  cityElement.addEventListener('click', (event) => {
    const clickedCity = event.target.textContent;
    cityInput.value = clickedCity;
    handleFormSubmit(event);
  });
  searchHistory.appendChild(cityElement);
}

// Event listener for form submission
const cityForm = document.getElementById('cityForm');
cityForm.addEventListener('submit', handleFormSubmit);
