document.addEventListener("DOMContentLoaded", function () {
  let place = "Astana";
  let htmlPlace = document.querySelector(".location__place");
  let htmlTemperature = document.querySelector(".temperature");
  let htmlWind = document.querySelector(".wind");
  let htmlDescription = document.querySelector(".desrription_location");
  let htmlForm = document.querySelector(".search__location");
  let htmlInput = htmlForm.querySelector("input[type='text']");
  let htmlImgWeather = document.querySelector(".weatherIMG");

  const API = `http://api.openweathermap.org/geo/1.0/direct?limit=5&appid=6e1d8dc51c469cac8afd31a78b90ebd9&q=`;
  const API2 = `https://api.openweathermap.org/data/2.5/weather?appid=6e1d8dc51c469cac8afd31a78b90ebd9&lat=`;

  getWeatherByCoordinats();

  htmlForm.addEventListener("submit", function (ev) {
    ev.preventDefault();

    place = htmlInput.value;

    getWeatherByCoordinats();
  });

  async function getCoordinats(place) {
    const locationByCoord = await fetch(API + place)
    .then(response => response.json());

    return locationByCoord;
  }

  async function getWeatherByCoordinats(i = 0) {
    const coordinates = await getCoordinats(place);

    let lat = coordinates[i].lat;
    let lon = coordinates[i].lon;

    await fetch(API2 +`${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => showWeather(data));
  }

  function showWeather(data) {
    htmlPlace.innerText = place;
    htmlTemperature.innerText = (data.main.temp - 273).toFixed(1) + "°C";
    htmlWind.innerText = data.wind.speed + " m/s";
    htmlDescription.innerText = data.weather[0].description;
    htmlImgWeather.src = getIconByDescription(data.weather[0].description);


  }

  function getIconByDescription(description) {
    const path = "/img/";
    const Mapping = {
      "Light snow": "snowy-1.svg",
      "Partly cloudy": "cloudy-1-day.svg",
      "Light rain": "rainy-1.svg",
      "Clear": "clear-night.svg",
      "Sunny": "clear-day.svg",
      "overcast clouds": "cloudy.svg",
      "haze": "haze.svg",
      "clear sky": "clear-day.svg",
      "broken clouds": "cloudy-1-day.svg",
    };

    description = description.split(",")[0];

    return path + Mapping[description];
  }
});
