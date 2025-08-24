const searchInput = document.querySelector(".search-input");
const currentWeather = document.querySelector(".current-weather");
const weatherList = document.querySelector(".weather-list");
const list = weatherList.querySelectorAll(".weather-item");
console.log(list);

const API_KEY = "6c75ad4ef1f94c2c822191921252408";
const getWeatherDetails = async (cityName) => {
  const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    // Destructuring
    const { current, forecast } = data;
    console.log(data);
    console.log(current);
    console.log(forecast);
    currentWeather.innerHTML = `<img src="icons/clouds.svg" alt="" class="weather-icon" />
          <h2 class="temperature">${Math.floor(
            current.temp_c
          )} <span>°C</span></h2>
          <p class="description">${current.condition.text}</p>`;

    console.log(weatherList);
    const hourForecast = forecast.forecastday[0].hour;
    console.log(hourForecast);

    list.forEach((item, index) => {
      item.innerHTML = `<p class="time">${hourForecast[index].time.slice(
        -5
      )}</p>
            <img src="icons/clouds.svg" class="weather-icon" alt="" />
            <p class="temperature">${Math.floor(
              hourForecast[index].temp_c
            )}°</p>`;
    });
    // const mewo = weatherList.innerHTML =
  } catch (error) {
    console.log(error);
  }
};

searchInput.addEventListener("keyup", (e) => {
  const cityName = searchInput.value.trim();
  if (e.key == "Enter" && cityName) {
    getWeatherDetails(cityName);
  }
});
