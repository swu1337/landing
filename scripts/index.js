window.onload = () => {
    let request = document.querySelector('.request');
    let population = document.querySelector('.population');
    let countries = document.querySelector('.countries');

    let showData = data => {
        let HTMLString = '<p class="countries-heading">Choose a country</p>';

        if(!data) return;
        if(data.length === 1) {
            //population.innerHTML = 
        } else {
            for(let country of data) {
                HTMLString += 
                `<section class="country">
                    <div class="country-name">${country.name}</div>
                    <figure class="country-flag">
                        <img src="${country.flag}" alt="flag of ${country.name}">
                    </figure>
                </section>`
            }
        }

        countries.innerHTML = HTMLString;
    }
    request.onclick = () => {
        population.innerHTML = 'Waiting...';
        let country = document.querySelector('.country').value;

        if(!country) return;

        fetch(`https://restcountries.eu/rest/v2/name/${country}`)
            .then(request => {
                if (!request.ok) throw Error("WTF are you doing");
                return request.json();
            })
            .then(data => {
                console.log(data);
                
                showData(data);
                //population.innerHTML =
            })
            .catch(error => {
                console.log(error);
            });
    };
};