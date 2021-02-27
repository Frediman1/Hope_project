const search = document.getElementById('search');
const matchList = document.getElementById('match-list');

// Search the animals json and filter it
const searchAnimal = async searchText => {
    // const res = await fetch(' http://localhost:3000/extinct'); //call the json file
    const res = await fetch('./extinct.json'); //call the json file
    const animals = await res.json(); //give us the items inside of the json

    // console.log(animals);

    // Get matches to current text input 
    let matches = animals.extinct.filter(animal => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return animal.name.match(regex);
    });
    // console.log(matches);

    if (searchText.length === 0) {
        matches = []; //clear the arrays when dlete in the search bar
        matchList.innerHTML = '';
    }

    outputHtml(matches);
};

// show results in HTML
const outputHtml = matches => {
    if (matches.length > 0) { //map returns an array from an array
        const html = matches.map(match => `
        <div class="card">
            <h3>${match.name}<span> | ${match.category}</span> </h3>
            <p>${match.year}</p>
            <p class="filter-description">${match.description}</p>
        </div>
        `).join('');
        // console.log(html);

        matchList.innerHTML = html;
    }
}
search.addEventListener('input', () => searchAnimal(search.value));


/*Third API CODE */
const api = {
    key: "5b8313a4583e251d0d16711e6335d75c",
    base: "https://api.openweathermap.org/data/2.5/", //air quality api
    base1: "https://api.openaq.org/v1/measurements" //long -lat api

}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(searchbox.value);
        //console.log(searchbox.value);
    }
}
function getResults(query) {
    try {
        fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
            .then(weatherResponse => {
                if (!weatherResponse.ok) {
                    console.log(`error occurred with status ${weatherResponse.statusText}`)
                    throw new Error(`City Not Found`);
                }
                return weatherResponse.json();
            }).then((weather) => {
                displayResults(weather);
                getAirQuality(weather.coord.lat, weather.coord.lon);
            }, (err) => {
                alert(err)
            });
    } catch {
        alert('City Not Found')
    }
}

function getAirQuality(lat, lon) {
    try {
        fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&APPID=${api.key}`)
            .then(aqResponse => {
                return aqResponse.json();
            }).then(displayAirQuality);
    } catch {
        alert('City Not Found')
    }
}

function displayAirQuality(aq) {
    console.log('air-quality', aq)
    if (aq.list.length == 0) {
        // no data, return
        return;
    }
    let airQualityIndex = document.getElementById('air-quality-index');
    airQualityIndex.innerText = `${aq.list[0].main.aqi}`

    const airQualityComponents = aq.list[0].components;
    console.log('airQualityComponents', airQualityComponents)
    // now do something with the air quality components!
    const carbonMonoxide = document.getElementById('carbon-monoxide');
    carbonMonoxide.innerHTML = `${airQualityComponents.co} μg/m<sup>3</sup>`
    const nitricOxide = document.getElementById('nitric-oxide');
    nitricOxide.innerHTML = `${airQualityComponents.no} μg/m<sup>3</sup>`
    const nitroDioxide = document.getElementById('nitro-dioxide');
    nitroDioxide.innerHTML = `${airQualityComponents.no2} μg/m<sup>3</sup>`
    const ozone = document.getElementById('ozone');
    ozone.innerHTML = `${airQualityComponents.o3} μg/m<sup>3</sup>`
    const sulphurDioxide = document.getElementById('sulphur-dioxide');
    sulphurDioxide.innerHTML = `${airQualityComponents.so2} μg/m<sup>3</sup>`
    const fineParticleMatter = document.getElementById('fine-particle');
    fineParticleMatter.innerHTML = `${airQualityComponents.pm2_5} μg/m<sup>3</sup>`
    const coarseParticulateMatter = document.getElementById('p-matter');
    coarseParticulateMatter.innerHTML = `${airQualityComponents.pm10} μg/m<sup>3</sup>`
    const ammonia = document.getElementById('ammonia');
    ammonia.innerHTML = `${airQualityComponents.nh3} μg/m<sup>3</sup>`


}

function displayResults(weather) {
    try {
        fetch(`${api.base1}?coordinates=${weather.coord.lat},${weather.coord.lon}`)
            .then(ap => {
                return ap.json();
            })
    } catch {
        alert('Enter More Precise Location');
    }

    console.log('weather', weather);
    let lat = document.getElementById('lat-value');
    lat.innerText = `${weather.coord.lat}`;
    let lon = document.getElementById('lon-value');
    lon.innerText = `${weather.coord.lon}`;
    let temp = document.getElementById('temp');
    temp.innerText = `${weather.main.temp}°C`;
    let location = document.querySelector('.location .city')
    location.innerText = `${weather.name},${weather.sys.country}`
    let date = new Date();
    let datenow = document.querySelector('.location .date')
    datenow.innerText = dateBuilder(date);

    function dateBuilder(d) {
        let months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December",
        ];
        let days = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`;
    }
}
