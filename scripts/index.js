window.onload = () => {
    //Using insertAdjacentHTML instead of innerHTML to insert HTMLstrings;
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    let input = document.querySelector('.input');
    let request = document.querySelector('.request');
    let selectedCountry = document.querySelector('.selected-country');
    let countries = document.querySelector('.countries');
    let search = document.querySelector('.search');
    let body = document.querySelector('body');
    let searchAgain = document.querySelectorAll('.search-again');
    let news = document.querySelector('.news');

    let removeError = parent => {if(document.querySelector('.error')) parent.removeChild(document.querySelector('.error'));};
    
    //Focus on the input when page is loaded;
    input.focus();

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
            //Check if area is not empty to prevent infinity;
            if(d.area) {
                d.density = (d.population / d.area).toFixed(2);
            } else {
                d.density = `No data`;
            }
        }
        return data;
    };

    let showData = data => {
        //Show button search again;
        searchAgain[1].classList.remove('hide');
        //Show yourself;
        countries.classList.remove('hide');
        //Hide selection of results;
        countries.classList.add('hide');
        //Create dynamic html with data from api;
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
        showNews();
    };

    let showNews = () => {
        fetch('https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=dAyy8S4zy2wexeaA81hhvP2eFqw5zO06')
            .then(response => response.json())
            .then(data => {
                //Show news section;
                news.classList.remove('hide');
                //Work around to get the index of item in an array; slice to get the last 6 items of an array;
                for(const [i, article] of data.results.slice(data.results.length - 7).entries()) {
                    //Create html for each article; //Removed the time from the published date;
                    news.insertAdjacentHTML('beforeend',
                        `<section class="news-content">
                            <a class="news-link" href="${article.url}">
                                <article class="news-article">
                                    <p class="news-article-title">${article.title}</p>
                                    <p class="news-article-byline">
                                        <span class="news-article-author">${article.byline}</span>
                                        ${new Date(article.published_date).toUTCString().split(' ').slice(0, 4).join(' ')}
                                    </p>
                                </article>
                            </a>
                        </section>`
                    );
                    //Select dynamic created section to set background, get the last image from media-meta;
                    document.querySelectorAll('.news-content')[i].style.backgroundImage = `url(${article.media[0]["media-metadata"][article.media[0]["media-metadata"].length - 1].url})`;
                }
            })
    }

    request.onclick = function() {
        let inputCountry = input.value;

        if(!inputCountry) return;
        //Make request;
        fetch(`https://restcountries.eu/rest/v2/name/${inputCountry}`)
            .then(request => {
                if (!request.ok) throw Error("What are you doing?");
                return request.json();
            })
            .then(data => {
                //Retrieve data;
                let dataString = `<p class="countries-heading">Choose a country</p>
                <p class="countries-query">Results for '${inputCountry}'</p>`;
                //Check if error message is there, if so remove it;
                removeError(countries);
                //Check if data object is empty;
                if(!data) return;
                //Add onclick to both search again button;
                for(let btn of searchAgain) {
                    btn.onclick = () => {
                        //Go back starting page;
                        location.reload();
                    }
                }
                //Hide the landing page;
                search.classList.add('hide');
                //Remove destracting bg when showing data;
                body.classList.add('no-bg');
                addDensity(data);
                
                if(data.length === 1) {
                    //Show the details of result country since is only 1;
                    showData(data[0]);
                } else {
                    //Create dynamic html when the result of search is more than one;
                    for(const country of data) {
                        dataString += 
                        `<section class="country-entry" data-name="${country.name}">
                            <p class="country-name">${country.name}</p>
                            <figure class="country-flag">
                                <img src="${country.flag}" alt="flag of ${country.name}" />
                            </figure>
                        </section>`;
                    }

                    //Show search again button;
                    searchAgain[0].classList.remove('hide');
                    //Show search results;
                    countries.classList.remove('hide');
                    countries.insertAdjacentHTML('afterbegin', dataString);
                    //Add onclick event to each result;
                    let countryEntries = document.querySelectorAll('.country-entry');
                    for(let country of countryEntries) {
                        country.onclick = function() {
                            //Getting the clicked data and use it as argument to showData function;
                            let selectedData = data.find(elem => elem.name === this.dataset.name);
                            showData(selectedData);
                        }
                    }
                }
            })
            .catch(error => {
                console.log(error);
                removeError(countries);
                countries.insertAdjacentHTML('afterbegin', `<p class="error">The country '${inputCountry}' not found!</p>`);
                input.value = '';
            });
    };
};