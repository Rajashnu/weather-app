const apiKey = "717618e588ff5f69b0182c637037a3be"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

var city;

let searchBox = document.querySelector("#input-field"); // Search input
const searchBtn = document.querySelector("#search_button"); // Search button
const weatherIcon = document.querySelector(".icons-image"); // Weather icon
const descriptionElement = document.querySelector(".weather_condition"); // Description element

async function handleCitySearch() {
  function capitalizeWords(preStr) {
    return preStr.split(' ').map(word => {
        if (word.length > 0) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
    }).join(' ');
  }
  let textInputCity = capitalizeWords(document.querySelector("#input-field").value);
  console.log(textInputCity);
  const city = textInputCity.trim();
  console.log(navigator.onLine);

  if (navigator.onLine){
    // Fetch weather data from the API
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=717618e588ff5f69b0182c637037a3be&units=metric`);
    const data = await response.json();
    console.log(data);
    if (data.cod === "404") {
      const errorMessage = document.querySelector(".errors");
      errorMessage.textContent = "The city you entered is not available. Please try again.";
      return;
    }

    // Update weather details on the page
    displayWeatherData(data);
  const currentDate = new Date();
     // Prepare weather data for sending to PHP script
     const weatherData = {
      city: data.name,
      date_on: currentDate,
      temperature: Math.round(data.main.temp),
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      weather: data.weather[0].main,
      description: data.weather[0].description,
    };

    // Store weather data in local storage
    localStorage.setItem(city, JSON.stringify(data));

    // Send weather data to the PHP script using AJAX
    fetch("connection.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(weatherData),
    })
      .then((response) => response.text())
      .catch((error) => console.error("Error in sending data:", error));
  
  }else{
    // Attempt to retrieve cached data from local storage
    const cachedWeatherData = localStorage.getItem(city);
    console.log(cachedWeatherData);
    if (cachedWeatherData) {
      const data = JSON.parse(cachedWeatherData);
      displayWeatherData(data);
      return;
    } else {
      // Display an error message if data is not available in local storage
      const errorMessage = document.querySelector(".errors");
      errorMessage.textContent = "No cached data available for this city.";
      return;
    }
  }
}

searchBtn.addEventListener("click", handleCitySearch);

searchBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleCitySearch();
  }
});


function displayWeatherData(data) {
  // Update weather details on the page
  document.querySelector(".city").textContent = data.name;
  document.querySelector(".temp").textContent =
    Math.round(data.main.temp) + "°C";
  document.querySelector(".pressure-value").textContent =
    data.main.pressure + "hPa";
  document.querySelector(".humidity-value").textContent =
    data.main.humidity + "%";
  document.querySelector(".wind-value").textContent =
    data.wind.speed + " km/h";

  // Get and display weather description
  const weatherDescription = data.weather[0].description;
  descriptionElement.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

  // Update weather icon based on weather condition using OpenWeatherMap API
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  weatherIcon.src = iconUrl;

  // Format and display the current date
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  document.querySelector(".date-value").textContent = formattedDate;
}

async function start(){

    // Check if the user is online
    const isOnline = navigator.onLine;
    city = "Wiltshire"

    console.log(navigator.onLine);

  if (navigator.onLine){
    // Fetch weather data from the API
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=717618e588ff5f69b0182c637037a3be&units=metric`);
    const data = await response.json();
    console.log(data);
    if (data.cod === "404") {
      const errorMessage = document.querySelector(".errors");
      errorMessage.textContent = "The city you entered is not available. Please try again.";
      return;
    }

    // Update weather details on the page
    displayWeatherData(data);
  const currentDate = new Date();
     // Prepare weather data for sending to PHP script
     const weatherData = {
      city: data.name,
      date_on: currentDate,
      temperature: Math.round(data.main.temp),
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      weather: data.weather[0].main,
      description: data.weather[0].description,
    };

    // Store weather data in local storage
    localStorage.setItem(city, JSON.stringify(data));

    // Send weather data to the PHP script using AJAX
    fetch("connection.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(weatherData),
    })
      .then((response) => response.text())
      .catch((error) => console.error("Error in sending data:", error));
  
  }else{
    // Attempt to retrieve cached data from local storage
    const cachedWeatherData = localStorage.getItem(city);
    console.log(cachedWeatherData);
    if (cachedWeatherData) {
      const data = JSON.parse(cachedWeatherData);
      displayWeatherData(data);
      return;
    } else {
      // Display an error message if data is not available in local storage
      const errorMessage = document.querySelector(".errors");
      errorMessage.textContent = "No cached data available for this city.";
      return;
    }
  }
}


start()