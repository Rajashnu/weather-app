const apiKey = "717618e588ff5f69b0182c637037a3be"; // Replace with your OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector("#input-field"); // Search input
const searchBtn = document.querySelector("#search_button"); // Search button
const weatherIcon = document.querySelector(".icons-image"); // Weather icon
const descriptionElement = document.querySelector(".weather_condition"); // Description element

function handleCitySearch() {
  const searchedCity = searchBox.value.trim();
  if (searchedCity) {
    checkWeather(searchedCity); // Call weather check function
    const errorMessage = document.querySelector(".errors");
    errorMessage.textContent = ""; // Reset error message
  } else {
    const errorMessage = document.querySelector(".errors");
    errorMessage.textContent = "Please provide a city name to get the weather information.";
  }
}

searchBtn.addEventListener("click", handleCitySearch);

searchBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleCitySearch();
  }
});

async function checkWeather(city) {
  try {
    // Fetch weather data from the API
    const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
    const data = await response.json();

    if (data.cod === "404") {
      const errorMessage = document.querySelector(".errors");
      errorMessage.textContent = "The city you entered is not available. Please try again.";
      return;
    }

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

    const myObj_serialized = JSON.stringify(weatherData);
    localStorage.setItem(city, myObj_serialized);

    const myObj_deserialized = localStorage.getItem(city);
    console.log(myObj_deserialized);
    const datas = JSON.parse(myObj_deserialized);
    

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
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
}

// Show weather information for the default city (Vale of Glamorgan) on page load
window.addEventListener("DOMContentLoaded", () => {
  if (!navigator.onLine) {
    const errorMessage = document.querySelector(".errors");
    errorMessage.textContent = "You are currently offline. Please check your internet connection.";
    
    return;
  }
  checkWeather("Wiltshire");
});