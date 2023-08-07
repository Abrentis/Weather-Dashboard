var APIKey = "d4bd32ecf29ececb6650006c372b062c";
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
fetch(queryURL)

// Built-in API request by city name 
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}