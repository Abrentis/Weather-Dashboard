var APIKey = "d4bd32ecf29ececb6650006c372b062c";
var formSubmission = $("#submit-form");
var searchButton = $("#search-submit");
var searchHistoryEl = $('#search-history');
var clearStorageBtn = $('#clear-storage');
var dateTodayEl = $("#date-today");
var cityNameEl = $('#city-name');
var weatherIconEl = $('#weather-icon');
var temperatureTodayEl = $('#temperature-today');
var humidityTodayEl = $('#humidity-today');
var windSpeedTodayEl = $('#wind-speed-today');
var fiveDayContainerEl = $('#weather-five-days');

weatherIconEl.hide();
// Clears search history
clearStorageBtn.on("click", function(event) {
    event.preventDefault;
    localStorage.clear();
    searchHistoryEl.empty();
});
// Event listener for data fetch and displaying results
formSubmission.on("submit", weatherData);
function weatherData(event) {
    event.preventDefault();
    var storedDatesArray = [];
    var storedTemperatures = [
        {storedTemperatures0: []},
        {storedTemperatures1: []},
        {storedTemperatures2: []},
        {storedTemperatures3: []},
        {storedTemperatures4: []},
        {storedTemperatures5: []}
    ];
    console.log(storedTemperatures);
    var storedHumidity = [];
    var storedWind = [];
    var storedIcon = [];
    var city = $("#search-input").val();
    cityNameEl.html(city);
    var weatherTodayURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

    fetch(weatherTodayURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        dateTodayEl.html(dayjs().format('YYYY-MM-DD'));
        var weatherIconID = data.weather[0].icon;
        var weatherIconURL = "http://openweathermap.org/img/w/" + weatherIconID + ".png";
        weatherIconEl.attr('src', weatherIconURL);
        weatherIconEl.show();
        temperatureTodayEl.html("Temperature: " + data.main.temp);
        humidityTodayEl.html("Humidity: " + data.main.humidity + "%");
        windSpeedTodayEl.html("Wind Speed: " + data.wind.speed + "/mph");
        console.log(data);
        var storageString = JSON.stringify(localStorage);
        if (localStorage.length == 0 && !city == undefined) {
            localStorage.setItem(city, weatherTodayURL);
            var storageString = JSON.stringify(localStorage);
            var newSearch = $('<button>', {
                id: city,
                class: 'btn btn-secondary my-2',
                type: 'button'
            });
            newSearch.html(city);
            searchHistoryEl.append(newSearch);
            newSearch.on("click", weatherData);
        }
        else if (!storageString.includes(city)) {
            localStorage.setItem(city, weatherTodayURL);
            var storageString = JSON.stringify(localStorage);
            var newSearch = $('<button>', {
                id: city,
                class: 'btn btn-secondary my-2',
                type: 'button'
            });
            newSearch.html(city);
            searchHistoryEl.append(newSearch);
            newSearch.on("click", weatherData);
        }
        console.log(localStorage);
    })

    var weatherFiveDaysURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=imperial";
    fetch(weatherFiveDaysURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        for (let i = 0; i < data.list.length; i++) {
            var storedDateFull = data.list[i].dt_txt;
            var splitDate = storedDateFull.split(' ');
            var storedDate = splitDate[0];
            if (!storedDatesArray.includes(storedDate)) {
                storedDatesArray.push(storedDate);
            }
        }
        for (let i = 0; i < storedDatesArray.length; i++) {
            data.list.forEach((temperature) => {
                //console.log(temperature);
                var dateSplitFiveDay = temperature.dt_txt.split(' ');
                if (dateSplitFiveDay[0] == storedDatesArray[i] && dateSplitFiveDay[1] == '12:00:00') {
                    var tempFiveDay = temperature.main.temp;
                    //console.log(storedTemperatures[i]);
                    storedTemperatures[i]['storedTemperatures' + i].push(tempFiveDay);
                    var humidityFiveDay = temperature.main.humidity;
                    storedHumidity.push(humidityFiveDay);
                    var windFiveDay = temperature.wind.speed;
                    storedWind.push(windFiveDay);
                    var iconFiveDay = temperature.weather[0].icon;
                    storedIcon.push(iconFiveDay);
                    console.log(storedTemperatures[i]);
                };
            })
        }
        console.log(storedDatesArray);

        var weatherContainers = [
            $("#day-1"),
            $("#day-2"),
            $("#day-3"),
            $("#day-4"),
            $("#day-5")
        ];
        weatherContainers[0].empty();
        weatherContainers[1].empty();
        weatherContainers[2].empty();
        weatherContainers[3].empty();
        weatherContainers[4].empty();
        for (let i = 1; i < storedDatesArray.length; i++) {
            var displayDate = document.createElement("p");
            displayDate.innerHTML = storedDatesArray[i];
            console.log(storedDatesArray);
            weatherContainers[i - 1].append(displayDate);

            var displayIcon = document.createElement("img");
            displayIcon.setAttribute('src', "http://openweathermap.org/img/w/" + storedIcon[i - 1] + ".png")
            weatherContainers[i - 1].append(displayIcon);

            var displayTemperature = document.createElement("p");
            displayTemperature.innerHTML = "Temperature: " + storedTemperatures[i]['storedTemperatures' + i];
            weatherContainers[i - 1].append(displayTemperature);

            var displayHumidity = document.createElement("p");
            displayHumidity.innerHTML = "Humidity: " + storedHumidity[i - 1] + "%";
            weatherContainers[i - 1].append(displayHumidity);

            var displayWind = document.createElement("p");
            displayWind.innerHTML = "Wind Speed: " + storedWind[i - 1] + "/mph";
            weatherContainers[i - 1].append(displayWind);
        }
    })
}

function renderStorage() {
    searchHistoryEl.empty();
    var keys = Object.keys(localStorage);
    keys.forEach((key) => {
      var newSearch = $('<button>', {
            id: key,
            class: 'btn btn-secondary my-2',
            type: 'button'
        });
        newSearch.html(key);
        searchHistoryEl.append(newSearch);
        newSearch.on("click", function() {
            city = $("#search-input").val(key);
            weatherData(event);
        });
    })
  }
  renderStorage();
// Built-in API request by city name 
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}