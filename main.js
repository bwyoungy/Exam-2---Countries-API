// Use IIFE
(()=>{ 
    "use strict"

    // Initialise global array variable to save countries from API
    let countriesArr = [];
    loadCountriesFromAPI();

    // Function to load all countries from the API
    async function loadCountriesFromAPI() {
        try {
            // Fetch countries from API
            const response = await fetch("https://restcountries.com/v3.1/all");
            const countriesAPI = await response.json();

            // Iterate over the countries from API and save to global array
            for (const country of countriesAPI) {
                countriesArr.push(country);
            }
        } catch (error) {
            // Alert user there was a problem retrieving the information
            alert("There was an error retrieving the information from the REST Countries API. Please try reloading the page or reach out to us.");
        }
    }
})()