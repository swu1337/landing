window.onload = () => {
    let input = document.querySelector('.input');
    let request = document.querySelector('.request');
    let selectedCountry = document.querySelector('.selected-country');
    let countries = document.querySelector('.countries');
    let search = document.querySelector('.search');
    let body = document.querySelector('body');
    let searchAgain = document.getElementsByClassName('search-again')[0];
    console.log(searchAgain);

    let getAdvice = data => {
        let advice = '';
        //Too Few people lives here;
        if(data.density <= 25) {
            advice = `The population density is very low. It's very hard find to people around. You should look for countries with more people density.`;
        }
        //Few people lives here;
        if(data.density > 25 && data.density <= 50) {
            advice = `The population density is low. It's hard to find people around. You should look for countries with more people density.`;
        }
        //Average amount of people lives here;
        if(data.density > 50 && data.density <= 100) {
            advice = `The population density is average. It's easy to find people around. If you desire to land here, it's a great place to land.`;
        }
        //Above average of people lives here;
        if(data.density > 100 && data.density <= 250) {
            advice = `The population density is high. It's very easy to find people around. If you desire to land here, it's a okay place to land.`;
        }
        //Too much people lives here;
        if(data.density > 250) {
            advice = `The population density is very high. There is too many people living next to each other. It's hard to land here. You should look for countries with less people density.`;
        }
        return advice;
    };
    let addDensity = data => {
        //Added density data property by dividing population by area of country;
        for(let d of data) {
            //check if area is not empty to prevent infinity;
            if(d.area) {
                d.density = (d.population / d.area).toFixed(2);
            } else {
                d.density = `No data`;
            }
        }
        return data;
    };
    let checkData = (data, query) => {
        let dataString = '';
        countries.innerHTML = '';
        countries.insertAdjacentHTML('afterbegin',
            `<p class="countries-heading">Choose a country</p>
            <p class="countries-query">Results for '${query}'</p>`
        );
        //Check if data object is empty;
        if(!data) return;

        search.classList.add('hide');
        body.classList.add('no-bg');
        addDensity(data);
        if(data.length === 1) {
            showData(data[0]);
        } else {
            //Create dynamic html when the result of search is more than one
            for(let country of data) {
                dataString += 
                `<section class="country-entry" data-name="${country.name}">
                    <p class="country-name">${country.name}</p>
                    <figure class="country-flag">
                        <img src="${country.flag}" alt="flag of ${country.name}" />
                    </figure>
                </section>`;
            }
            countries.classList.remove('hide');
            //countries.innerHTML += dataString;
            let countryEntries = document.querySelectorAll('.country-entry');
            //Add onclick event to each result;
            for(let country of countryEntries) {
                country.onclick = function() {
                    //Getting the clicked data and use it as argument to showData function;
                    let selectedData = data.find(elem => elem.name === this.dataset.name);
                    showData(selectedData);
                }
            }
        }
        searchAgain.onclick = function() {
            console.log('eww');
            //Go back starting page;
            selectedCountry.classList.add('hide');
            countries.classList.add('hide');
            search.classList.remove('hide');
        };
    };
    let showData = data => {
        //Show yourself;
        selectedCountry.classList.remove('hide');
        //Hide selection of results
        countries.classList.add('hide');
        //Create dynamic html with data from api
        selectedCountry.insertAdjacentHTML('afterbegin',
            `<h2 class="card-title">Landing information</h2>
            <section class="card name">
                <h3 class="card-label">Country Name</h3>
                <p class="card-value">${data.name}</p>
            </section>
            <section class="card flag">
                <h3 class="card-label">Flag</h3>
                <figure class="card-figure">
                    <img class="card-image" src="${data.flag}" alt="flag of ${data.name}" />
                </figure>
            </section>
            <section class="card name">
                <h3 class="card-label">Region</h3>
                <p class="card-value">${data.region}</p>
            </section>
            <section class="card name">
                <h3 class="card-label">Coordinates</h3>
                <p class="card-value">${data.latlng[0] ? data.latlng[0] : 'Unknown'} ${data.latlng[0] ? ',' : ''} ${data.latlng[1] ? data.latlng[1] : ''}</p>
            </section>
            <section class="card population">
                <h3 class="card-label">Population</h3>
                <p class="card-value">${data.population}</p>
            </section>
            <section class="card density">
                <h3 class="card-label">Density p/km2</h3>
                <p class="card-value">${data.density}</p>
            </section>
            <section class="card advice">
            <h3 class="card-label">Advice</h3>
                <p class="card-value">${getAdvice(data)}</p>
            </section>`
        );
    };

    request.onclick = function() {
        let inputCountry = input.value;

        if(!inputCountry) return;

        fetch(`https://restcountries.eu/rest/v2/name/${inputCountry}`)
            .then(request => {
                if (!request.ok) throw Error("What are you doing?");
                return request.json();
            })
            .then(data => {      
                checkData(data, inputCountry);
            })
            .catch(error => {
                console.log(error);
                countries.innerHTML = `No countries found!`;
            });
    };
};