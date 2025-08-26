const searchInput = document.querySelector(".search-input");
const currentWeather = document.querySelector(".current-weather");
const weatherList = document.querySelector(".weather-list");

const locateButton = document.querySelector(".locate-button");

const list = weatherList.querySelectorAll(".weather-item");
const weatherCodes = {
  clear: [1000],
  clouds: [1003, 1006, 1009],
  mist: [1030, 1135, 1147],
  // prettier-ignore
  rain: [
    1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1240, 1243, 1246, 1273, 1276,
  ],
  moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
  snow: [
    1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222,
    1225, 1237, 1249, 1252, 1255, 158, 1261, 1264, 1279, 1282,
  ],
  thunder: [1087, 1279, 1282],
  thunder_rain: [1273, 1276],
};

const displayHourlyForecast = function (hourlyData) {
  const currentHour = new Date().setMinutes(0, 0, 0);
  const next24Hours = currentHour + 24 * 60 * 60 * 1000;

  const next24HoursData = hourlyData.filter(({ time }) => {
    const forecastTime = new Date(time).getTime();
    return forecastTime >= currentHour && forecastTime <= next24Hours;
  });

  weatherList.innerHTML = next24HoursData
    .map((item) => {
      const temperature = Math.floor(item.temp_c);

      const time = item.time.split(" ")[1].substring(0, 5);
      const weatherIcon = Object.keys(weatherCodes).find((icon) =>
        weatherCodes[icon].includes(item.condition.code)
      );

      return ` <li class="weather-item">
            <p class="time">${time}</p>
            <img src="icons/${weatherIcon}.svg" class="weather-icon" alt="" />
            <p class="temperature">${temperature}°</p>
          </li>`;
    })
    .join("");
};

const API_KEY = "6c75ad4ef1f94c2c822191921252408";
const getWeatherDetails = async (API_URL) => {
  // const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;

  window.innerWidth <= 768 && searchInput.blur();
  document.body.classList.remove("show-no-results");
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    // Destructuring

    const { current, forecast } = data;
    console.log(data);
    // console.log(current);
    // console.log(forecast);
    const weatherIcon = Object.keys(weatherCodes).find((icon) =>
      weatherCodes[icon].includes(current.condition.code)
    );
    console.log(weatherIcon);
    currentWeather.innerHTML = `<img src="icons/${weatherIcon}.svg" alt="" class="weather-icon" />
          <h2 class="temperature">${Math.floor(
            current.temp_c
          )} <span>°C</span></h2>
          <p class="description">${current.condition.text}</p>`;

    const hourForecast = forecast.forecastday[0].hour;

    const combinedHourlyData = [
      ...forecast.forecastday[0].hour,
      ...forecast.forecastday[1].hour,
    ];
    displayHourlyForecast(combinedHourlyData);

    searchInput.value = data.location.name;

    // list.forEach((item, index) => {
    //   item.innerHTML = `<p class="time">${hourForecast[index].time.slice(
    //     -5
    //   )}</p>
    //         <img src="icons/${weatherIcon}.svg" class="weather-icon" alt="" />
    //         <p class="temperature">${Math.floor(
    //           hourForecast[index].temp_c
    //         )}°</p>`;
    // });
  } catch (error) {
    document.body.classList.add("show-no-results");
  }
};

const setupWeatherRequest = (cityName) => {
  const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
  getWeatherDetails(API_URL);
};

searchInput.addEventListener("keyup", (e) => {
  const cityName = searchInput.value.trim();
  if (e.key == "Enter" && cityName) {
    setupWeatherRequest(cityName);
  }
});

locateButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
      getWeatherDetails(API_URL);
    },
    (error) => {
      alert(
        "Location access denies, Please enable permissions to use this feature."
      );
    }
  );
});
