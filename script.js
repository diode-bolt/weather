document.addEventListener("DOMContentLoaded", function () {
  let place = "Astana",
      htmlPlace = document.querySelector(".location__place"),
      htmlTemperature = document.querySelector(".temperature__now"),
      htmlTempMin = document.querySelector(".temperature__min"),
      htmlTempMax = document.querySelector(".temperature__max"),
      htmlWind = document.querySelector(".wind"),
      directionWind = document.querySelector('.arrow-wind'),
      htmlDescription = document.querySelector(".desrription_location"),
      htmlLastUpdate = document.querySelector(".location__last-update"),
      htmlForm = document.querySelector(".search__location"),
      htmlInput = htmlForm.querySelector("input[type='text']"),
      htmlImgWeather = document.querySelector(".weatherIMG"),
      htmlHumidity = document.getElementById('humidity'),
      arrowHumidity = document.getElementById('arrow'),
      htmlPressure = document.getElementById('pressure'),
      currentDate = document.querySelector('.location__date'),
      placesList = document.createElement('ol');
  placesList.className = "places-list";

  let lastPlaces;

  const API = 'https://api.openweathermap.org/geo/1.0/direct?limit=5&appid=6e1d8dc51c469cac8afd31a78b90ebd9&q=',
        API2 = 'https://api.openweathermap.org/data/2.5/weather?appid=6e1d8dc51c469cac8afd31a78b90ebd9&lat=';

  currentDate.innerText = new Intl.DateTimeFormat({weekday: 'short', day: '2-digit', month: 'short'}).format(new Date());

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

  htmlForm.addEventListener("keydown", getPlaces );

  htmlForm.addEventListener("submit", function(ev) {
    ev.preventDefault();
    placesList.remove();

    if (!htmlInput.value) {
      alert("enter place");
      return;
    }
    getWeatherByCoordinats();
  });

  placesList.addEventListener("click",(event) => {
    let i = event.target.index;

    getWeatherByCoordinats(i);
    placesList.remove();
  });

  document.addEventListener("click", (ev) => {
    if (ev.target == htmlInput) return;
    placesList.remove();
  });

  function showPlaces(places) {
    if (placesList.innerHTML) placesList.innerHTML = '';
    if (places.length == 0) {
      alert("Place not found!");
      return;
    }

    htmlForm.after(placesList);
    placesList.append(createListContent(places));
  }

  function createListContent(text) {
    let fragment = new DocumentFragment();

    for(let i = 0; i < text.length; i++) {
      let li = document.createElement('li');
      if (text[i].state) {
        li.append(text[i].name + ", country: " + text[i].country + ", state: " + text[i].state);
      } else li.append(text[i].name + ", country: " + text[i].country);

      li.index = i;
      fragment.append(li);
    }

    return fragment;
  }

  async function getCoordinats(place) {
    return await fetch(API + place)
    .then(response => response.json())
    .catch(err => {
      alert("whoops! Something went wrong : " + err);
    });
  }

  async function getWeatherByCoordinats(i = 0) {
    let coordinates;

    if (arguments.length == 0) {
      coordinates = await getCoordinats(htmlInput.value);
    } else coordinates = lastPlaces;

    if(!coordinates[i]) return;

    let lat = coordinates[i].lat;
    let lon = coordinates[i].lon;
    place = coordinates[i].name;

    await fetch(API2 +`${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => showWeather(data))
    .catch(err => {
      alert("whoops! Something went wrong : " + err);
    });
  }

  function showWeather(data) {
    htmlPlace.innerText = place;
    htmlTemperature.innerText = Math.round( (data.main.temp - 273).toFixed(1) ) + "°C";
    htmlWind.innerText = data.wind.speed + " m/s";
    // htmlDescription.innerText = data.weather[0].description;
    htmlImgWeather.src = getIconByDescription(data.weather[0].description);
    htmlImgWeather.alt = htmlImgWeather.title = data.weather[0].description;
    htmlHumidity.innerText = data.main.humidity + "%";
    htmlPressure.innerText = Math.round(data.main.pressure / 1.333) + " mmHg";
    htmlTempMin.innerText = Math.round( (data.main['temp_min'] - 273).toFixed(1) ) + "°C";
    htmlTempMax.innerText = Math.round( (data.main['temp_max'] - 273).toFixed(1) ) + "°C";
    htmlLastUpdate.innerText = `last update in ${new Date().getHours()}: ${new Date().getMinutes()}`
    rotateArrowSensorHumidity(data.main.humidity);
    rotateArrowWind(data.wind.deg);
  }

  function getIconByDescription(description) {
    const path = "img/";
    const Mapping = {
      "light snow": "snowy-1.svg",
      "partly cloudy": "cloudy-1-day.svg",
      "light rain": "rainy-1.svg",
      "clear": "clear-night.svg",
      "Sunny": "clear-day.svg",
      "overcast clouds": "cloudy.svg",
      "haze": "haze.svg",
      "clear sky": "clear-day.svg",
      "broken clouds": "cloudy-1-day.svg",
      "scattered clouds": "cloudy-1-day.svg",
      "clear day": "clear-day.svg",
    };

    description = description.split(",")[0];

    return path + Mapping[description];
  }

  function rotateArrowSensorHumidity(per) {
    arrowHumidity.style.transform = `rotate(${-180 + per * 2}deg)`;
  }

  function rotateArrowWind(deg) {
    directionWind.style.transform = `rotate(${deg - 90}deg)`
  }

});

