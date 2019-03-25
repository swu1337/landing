window.onload = () => {
    let request = document.querySelector('.request');
    let selectedCountry = document.querySelector('.selected-country');
    let countries = document.querySelector('.countries');
    let checkData = data => {
        let HTMLString = '<p class="countries-heading">Choose a country</p>';
        if(!data) return;

        addDensity(data);
        if(data.length === 1) {
            showData(data);
        } else {
            for(let country of data) {
                HTMLString += 
                `<section class="country-entry" data-name="${country.name}">
                    <p class="country-name">${country.name}</p>
                    <figure class="country-flag">
                        <img src="${country.flag}" alt="flag of ${country.name}" />
                    </figure>
                </section>`;
            }

            countries.innerHTML = HTMLString;
            let countryEntries = document.querySelectorAll('.country-entry');
            for(let country of countryEntries) {
                country.onclick = function() {
                    let selectedData = data.find(elem => elem.name === this.dataset.name);
                    showData(selectedData);
                }
            }
        }
    }

    let checkDensity = data => {
        if(data.density <= 2) {
            
        }
        
        if(data.density > 2 && data.density <= 10) {

        }

        if(data.density > 10 && data.density <= 40) {
            
        }

        if(data.density > 40 && data.density <= 100) {
            
        }

        if(data.density > 100 && data.density <= 500) {
            
        }

        if(data.density > 500) {

        }
    }

    let addDensity = data => {
    //Added data density property by dividing population by area of results country;
        for(let d of data) {
            d.density = (d.population / d.area).toFixed(2);
        }
        return data;
    }

    let showData = data => {
        countries.classList.add('hide');
        selectedCountry.innerHTML = `
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
            <p class="card-value">${data.latlng[0]}, ${data.latlng[1]}</p>
        </section>
        <section class="card population">
            <h3 class="card-label">Population</h3>
            <p class="card-value">${data.population}</p>
        </section>
        <section class="card density">
            <h3 class="card-label">Density p/km2</h3>
            <p class="card-value">${data.density}</p>
        </section>`;
        
        checkDensity(data);
    };

    request.onclick = () => {
        let country = document.querySelector('.country').value;

        if(!country) return;

        fetch(`https://restcountries.eu/rest/v2/name/${country}`)
            .then(request => {
                if (!request.ok) throw Error("WTF are you doing?");
                return request.json();
            })
            .then(data => {               
                checkData(data);
            })
            .catch(error => {
                console.log(error);
                countries.innerHTML = `No countries found!`;
            });
    };
};