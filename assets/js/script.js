const apiKey = '93e9722ea069f294426abff327f03f6c';

// Function to fetch weather data
async function getWeatherData(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
  const data = await response.json();
  return data;
}

// Function to format date as MM/DD/YYYY
function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

// Function to display current weather
function displayCurrentWeather(city, date, icon, temperature, humidity, windSpeed) {
  const currentWeather = document.getElementById('currentWeather');
  const formattedDate = dayjs(date).format('M/DD/YYYY');
  const temperatureFahrenheit = Math.round((temperature - 273.15) * 9 / 5 + 32);
  currentWeather.innerHTML = `
    <h2>${city.name} (${formattedDate}) <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon"></h2>
    <p>Temp: ${temperatureFahrenheit} °F</p>
    <p>Wind: ${windSpeed} MPH</p>
    <p>Humidity: ${humidity}%</p>
  `;
}

// Function to display forecast
function displayForecast(forecastData) {
  const forecast = document.getElementById('forecast');
  forecast.innerHTML = '';
  // Get the current date
  const currentDate = new Date();
  forecastData.forEach((forecastItem, index) => {
    // Calculate the date for the forecast item
    const date = new Date();
    date.setDate(currentDate.getDate() + index + 1); 

    if (index < 5) {
      const { icon, temperature, humidity, windSpeed } = forecastItem;
      const formattedDate = dayjs(date).format('MM/DD/YYYY');
      const temperatureFahrenheit = Math.round((temperature - 273.15) * 9 / 5 + 32);

      const forecastItemElement = document.createElement('div');
      forecastItemElement.classList.add('forecast-item');
      forecastItemElement.innerHTML = `
        <p>Date: ${formattedDate}</p>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperatureFahrenheit} °F</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind Speed: ${windSpeed}</p>
      `;
      forecast.appendChild(forecastItemElement);
    }
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
    event.stopPropoagation();
    const clickedCity = event.target.textContent;
    cityInput.value = clickedCity;
    getWeatherData(clickedCity) // Fetch weather data for clicked city
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
      })), city);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while fetching weather data. Please try again.');
    });
  });
  searchHistory.appendChild(cityElement);
  saveToLocalStorage(city);
}

// Function to handle click on search history buttons
function handleSearchHistoryClick(city) {
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
        displayCurrentWeather(city.name, date, icon, temperature, humidity, windSpeed);
        displayForecast(forecast.map((item) => ({
          date: item.dt_txt,
          icon: item.weather[0].icon,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        })), city);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while fetching weather data. Please try again.');
      });
  }
  
  // Function to add city to search history
  function addToSearchHistory(city) {
    const searchHistory = document.getElementById('searchHistory');
    const cityElement = document.createElement('button');
    cityElement.textContent = city.name;
    cityElement.addEventListener('click', () => handleSearchHistoryClick(city.name));
    searchHistory.appendChild(cityElement);
    saveToLocalStorage(city); // Save city to local storage
  }
  

// Function to save city to local storage
function saveToLocalStorage(city) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (!searchHistory) {
      searchHistory = [];
    } else {
      searchHistory = JSON.parse(searchHistory);
    }
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
  
  // Function to load search history from local storage
  function loadSearchHistory() {
    const searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
      const cities = JSON.parse(searchHistory);
      clearSearchHistory();
      cities.forEach((city) => {
        addToSearchHistory(city);
      });
    }
  }

// Event listener for form submission
const cityForm = document.getElementById('cityForm');
cityForm.addEventListener('submit', handleFormSubmit);

// Check if search history has already been loaded
let searchHistoryLoaded = false;

// Load search history from local storage on page load
window.addEventListener('load', () => {
  if (!searchHistoryLoaded) {
    loadSearchHistory();
    searchHistoryLoaded = true;
  }
});

// Function to clear search history
function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    const searchHistory = document.getElementById('searchHistory');
    searchHistory.innerHTML = '';
  }
  
  // Event listener for clear search history button
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  clearHistoryBtn.addEventListener('click', clearSearchHistory);
  