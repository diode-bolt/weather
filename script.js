document.addEventListener("DOMContentLoaded",function(){
    let place = "Astana";
    const API = "https://goweather.herokuapp.com/weather/";

    let htmlForm = document.querySelector(".search__location")
    let htmlInput = htmlForm.querySelector("input[type='text']");

    htmlForm.addEventListener("submit", function(ev){
        ev.preventDefault();

        place = htmlInput.value;

        getWeather()
    })


    let htmlPlace = document.querySelector(".location__place");
    let htmlTemperature = document.querySelector(".temperature");
    let htmlWind = document.querySelector(".wind");
    let htmlDescription = document.querySelector(".desrription_location");


    getWeather();
    function getWeather() {
      fetch(API + place)
        .then((response) => {
          return response.json();
        })
        .then((weather) => {
            showWeather(weather)
        });
    }

    function showWeather(data){
          htmlPlace.innerText = place;
          htmlTemperature.innerText = data.temperature;
          htmlWind.innerText = data.wind;
          htmlDescription.innerText = data.description;
    }




})
