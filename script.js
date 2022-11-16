document.addEventListener("DOMContentLoaded", function () {
  const API = "https://goweather.herokuapp.com/weather/";

  let place = "Astana";
  let htmlPlace = document.querySelector(".location__place");
  let htmlTemperature = document.querySelector(".temperature");
  let htmlWind = document.querySelector(".wind");
  let htmlDescription = document.querySelector(".desrription_location");
  let htmlForm = document.querySelector(".search__location");
  let htmlInput = htmlForm.querySelector("input[type='text']");
  let htmlImgWeather = document.querySelector(".weatherIMG");

  getWeather();

  htmlForm.addEventListener("submit", function (ev) {
    ev.preventDefault();

    place = htmlInput.value;

    getWeather();
  });

  function getWeather() {
    fetch(API + place)
      .then((response) => {
        return response.json();
      })
      .then((weather) => {
        showWeather(weather);

      });
  }

  function showWeather(data) {
    htmlPlace.innerText = place;
    htmlTemperature.innerText = data.temperature;
    htmlWind.innerText = data.wind;
    htmlDescription.innerText = data.description;
    htmlImgWeather.src = getIconByDescription(data.description);

  }

  function getIconByDescription (description) {
    const path = "/img/";
    const Mapping = {
      "Light snow": "snowy-1.svg",
      "Partly cloudy": "cloudy-1-day.svg",
      "Light rain": "rainy-1.svg",
      "Clear": "clear-night.svg",
      "Sunny": "clear-day.svg",
    }

    description = description.split(",")[0];

    return path + Mapping[description];
  }


});
