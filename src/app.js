function formatDate(timestamp){
    let date = new Date(timestamp);
    let hours = date.getHours();
    if(hours < 10){
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if(minutes < 10){
      minutes = `0${minutes}`;
    }
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
}

function displayTemperature(response){
    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(response.data.main.temp);
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.name;
    let descriptionElement = document.querySelector("#description");
    descriptionElement.innerHTML = response.data.weather[0].description;
    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.main.humidity;
    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.wind.speed);
    let dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(response.data.dt*1000);
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt",response.data.weather[0].description);

    celsiusTemperature = response.data.main.temp;

    let latitude = response.data.coord.lat;
    let longitude = response.data.coord.lon;
    let apiKey = "936a50f4c5816a4cf5f3c262e7a4d70f";
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForcast);
}

function formatWeekday(timestamp){
    let date = new Date(timestamp);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
    return `${day}`;
}

function displayForcast(response){
    let forcastElement = document.querySelector("#forcast");
    forcastElement.innerHTML = null;
    let forcast = null;

    for (let index = 0; index < 6; index++) {
      forcast = response.data.daily[index];
      forcastElement.innerHTML +=`
              <div class="col-2">
                  <h3>
                    ${formatWeekday(forcast.dt*1000)}
                  </h3>
                  <img src="http://openweathermap.org/img/wn/${forcast.weather[0].icon}@2x.png" alt="${forcast.weather[0].main}">
                  <div class="weather-forcast-temp">
                      <strong>${Math.round(forcast.temp.max)}°</strong> ${Math.round(forcast.temp.min)}°
                  </div>
              </div>
    `
    }
}

function search(city){
  let apiKey = "936a50f4c5816a4cf5f3c262e7a4d70f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature); 
}

function handleSubmit(event){
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value)
}

function displayFahrenheitTemperature(event){
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    celsiusLink.classList.remove("inactiv");
    fahrenheitLink.classList.add("inactiv");
    let fahrenheitTemperature = (celsiusTemperature * 9)/5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event){
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    celsiusLink.classList.add("inactiv");
    fahrenheitLink.classList.remove("inactiv");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function showPosition(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "936a50f4c5816a4cf5f3c262e7a4d70f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForcast);
}

function getCurrentPosition(event){
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let button = document.querySelector("button");
button.addEventListener("click",getCurrentPosition);

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Taipei");