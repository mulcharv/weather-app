
const getCoord = function coordData(location, units) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=ae3d8827969bcec0fd4b9ec4db407dd7
    `, {mode: 'cors'})
.then(function(response) {
    return response.json();
})
.catch(function(err) {
    let errormsg = document.getElementById('errormsg');
    errormsg.textContent = 'Location not found. Please enter a valid city name';
})
.then(function(response) {
    let coord = [];
    coord.push(response[0].lat);
    coord.push(response[0].lon);
    console.log(coord);
    return coord;
})
.then(function(response) {
    if (units == 'metric') {
    return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${response[0]}&lon=${response[1]}&units=metric&appid=ae3d8827969bcec0fd4b9ec4db407dd7
     `, {mode: 'cors'})
    }
    else if(units == 'imperial') {
    return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${response[0]}&lon=${response[1]}&units=imperial&appid=ae3d8827969bcec0fd4b9ec4db407dd7
    `, {mode: 'cors'})
    }
})
.then(function(response) {
    return response.json();
})
.then(function(response) {
    console.log(response);
    currentweatherfirst(units, response.current.weather[0].icon, response.current.temp, location, response.current.weather[0].description);
    currentweathersecond(units, response.current.feels_like, response.current.humidity, response.current.wind_speed, response.current.pressure);
    return response;
})
}

const stringupper = function raisestring(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const currentweatherfirst = function current1(units, icon, temp, location, description) {
    let statusimg = document.getElementById('statusimg');
    statusimg.src = `http://openweathermap.org/img/wn/${icon}.png`;

    let temperature = document.getElementById('temperature');
    if (units == 'metric') {
    temperature.textContent = `${temp}°C`;
    }
    else if (units == 'imperial') {
    temperature.textContent = `${temp}°F`;
    }

    let locationname = document.getElementById('locationname');
    locationname.textContent = stringupper(location);

    let weatherdesc = document.getElementById('weatherdesc');
    weatherdesc.textContent = stringupper(description);

    let timedate = document.getElementById('timedate');
    let d = new Date();
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = weekday[d.getDay()];
    let time = d.getHours() + ':' + d.getMinutes();
    timedate.textContent = `${day}, ${time}`;
}

const currentweathersecond = function current2(units, feelslike, humidity, windspeed, pressurereading) {
    let feelsliketemp = document.getElementById('feelsliketemp');
    let humidityper = document.getElementById('humidityper');
    let wind = document.getElementById('wind');
    let pressure = document.getElementById('pressure');

        if (units == 'metric') {
        feelsliketemp.textContent = `${feelslike}°C`;
        wind.textContent = `${windspeed}m/s`;
        }
        else if (units == 'imperial') {
        feelsliketemp.textContent = `${feelslike}°F`;
        wind.textContent = `${windspeed}mph`;
        }
    
    humidityper.textContent = `${humidity}%`;
    pressure.textContent = `${pressurereading}hPa`;
}
   

const unitsetting = () => {
    let celcius = document.getElementById('celcius');
    let farenheit = document.getElementById('farenheit');

    celcius.addEventListener('click', function(e) {
        if (celcius.classList.contains('unclicked')) {
            celcius.classList.remove('unclicked');
            celcius.classList.add('clicked');
            farenheit.classList.remove('clicked');
            farenheit.classList.add('unclicked');

            let city = window.localStorage.getItem('savedlocation');
            console.log(city);
            getCoord(city, 'metric');
        }

        
    })

    farenheit.addEventListener('click', function(e) {
        if (farenheit.classList.contains('unclicked')) {
            farenheit.classList.remove('unclicked');
            farenheit.classList.add('clicked');
            celcius.classList.remove('clicked');
            celcius.classList.add('unclicked');

            let city = window.localStorage.getItem('savedlocation');
            getCoord(city, 'imperial');
            console.log(city);
        }
    })
}


const inputlistener = () => {
    let search = document.getElementById('search');        
    search.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
           let  selectedunit = document.querySelector('.clicked');
           if (selectedunit.id === 'celcius') {
               getCoord(search.value, 'metric')
           }
           else if (selectedunit.id === 'farenheit') {
               getCoord(search.value, 'imperial')
           }
           window.localStorage.setItem('savedlocation', search.value);
           search.value="";
        }
        })
    } 
    
unitsetting();
inputlistener();

