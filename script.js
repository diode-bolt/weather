document.addEventListener("DOMContentLoaded", function () {
  let place = "Astana";
  let htmlPlace = document.querySelector(".location__place");
  let htmlTemperature = document.querySelector(".temperature");
  let htmlWind = document.querySelector(".wind");
  let htmlDescription = document.querySelector(".desrription_location");
  let htmlForm = document.querySelector(".search__location");
  let htmlInput = htmlForm.querySelector("input[type='text']");
  let htmlImgWeather = document.querySelector(".weatherIMG");
  let div = document.createElement('div');
  let ol = document.createElement('ol');
  let lastPlaces;

  const API = 'https://api.openweathermap.org/geo/1.0/direct?limit=5&appid=6e1d8dc51c469cac8afd31a78b90ebd9&q=';
  const API2 = 'https://api.openweathermap.org/data/2.5/weather?appid=6e1d8dc51c469cac8afd31a78b90ebd9&lat=';

  getWeatherByCoordinats();

  div.className = "places";
  ol.className = "places-list";

  htmlForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    div.remove();
    place = htmlInput.value;
    if (!place) return;

    getWeatherByCoordinats();
  });

  ol.addEventListener("click",(event) => {
    let i = event.target.index;

    getWeatherByCoordinats(i);
    place = lastPlaces[i].name;
    div.remove();
  });

  document.addEventListener("click", (ev) => {
    if (ev.target == htmlInput) return;
    div.remove();
  });

  let getPlaces = function() {
    let timerId;

    function timer() {
      if(timerId) {
        clearTimeout(timerId);
      }

      timerId = setTimeout(async function() {
        if (htmlInput.value == "") return;

        let places = await getCoordinats(htmlInput.value);
        lastPlaces = places;

        showPlaces(places);
      }, 1000);
    }

    return timer;
  }();

  htmlForm.addEventListener("keydown",() => getPlaces() );

  function showPlaces(places) {
    if (ol.innerHTML) ol.innerHTML = '';

    htmlForm.after(div);
    div.append(ol);
    ol.append(createListContent(places));
  }

  function createListContent(text) {
    let fragment = new DocumentFragment();

    for(let i = 0; i < text.length; i++) {
      let li = document.createElement('li');
      if (text[i]?.state != undefined) {
        li.append(text[i].name + ", country: " + text[i].country + ", state: " + text[i].state);
        fragment.append(li);
      } else li.append(text[i].name + ", country: " + text[i].country);

      li.index = i;
      fragment.append(li);
    }

    return fragment;
  }

  async function getCoordinats(place) {
    return await fetch(API + place)
    .then(response => response.json());
  }

  async function getWeatherByCoordinats(i = 0) {
    let coordinates;

    if (arguments.length == 0) {
      coordinates = await getCoordinats(place);
    } else coordinates = lastPlaces;

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
    const path = "img/";
    const Mapping = {
      "light snow": "snowy-1.svg",
      "Partly cloudy": "cloudy-1-day.svg",
      "Light rain": "rainy-1.svg",
      "Clear": "clear-night.svg",
      "Sunny": "clear-day.svg",
      "overcast clouds": "cloudy.svg",
      "haze": "haze.svg",
      "clear sky": "clear-day.svg",
      "broken clouds": "cloudy-1-day.svg",
      "scattered clouds": "cloudy-1-day.svg",
    };

    description = description.split(",")[0];

    return path + Mapping[description];
  }
});
