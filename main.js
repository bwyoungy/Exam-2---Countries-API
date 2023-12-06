// Use IIFE
(()=>{ 
    "use strict"

    // Initialise global array variable to save countries from API
    let countriesArr = [];
    loadCountriesFromAPI();

    /* Save DOM elements used more than once as variables to save times accessing DOM */
    const searchBtnObj = document.getElementById("searchBtn");
    const displayObj = document.getElementById("countriesDisplay");
    
    /* Bind functions to buttons */
    document.getElementById("getAllBtn").addEventListener("click", searchCountries);
    searchBtnObj.addEventListener("click", searchCountries);

    // Function to load all countries from the API
    async function loadCountriesFromAPI() {
        try {
            // Fetch countries from API
            const response = await fetch("https://restcountries.com/v3.1/all");
            const countriesAPI = await response.json();

            // Iterate over the countries from API and add each one to global array
            for (const country of countriesAPI) {
                countriesArr.push(country);
            }
        } catch (error) {
            // Alert user there was a problem retrieving the information
            alert("There was an error retrieving the information from the REST Countries API. Please try reloading the page or reach out to us.");
        }
    }

    /* Function to search for countries based on user's input or all countries
    Displays the countries' information and statistics per requirement */
    function searchCountries() {
        // Set searchterm data of search button as the search input box value for easy access later to searchterm
        searchBtnObj.dataset.searchterm = document.getElementById("searchBox").value;

        // Save searchType chosen from select box
        let searchType = document.getElementById("searchType").value;

        // Get array of search results filtering each country's name by the searchterm, converting both to lowercase to avoid mismatch due to case differences
        // (using eval to prevent code duplication and unnecessary conditions)
        let searchResults = countriesArr.filter(country=>eval(`country.name.${searchType}.toLowerCase().includes(this.dataset.searchterm.toLowerCase())`));

        // Check if no countries were found
        if (searchResults.length === 0) {
            // Display message to user explaining lack of data displayed
            displayObj.innerHTML = "No countries were found matching the search"
            // Exit searchCountries function
            return;
        }

        // Initialise HTML info with header
        let html = "<h2>Search results: </h2>";

        // Add number of countries found
        html += `<p>Total countries: ${searchResults.length}</p>`;

        // Save total population as a variable so as to call function once
        let totalPopulation = sumTotalPopulation(searchResults);

        // Add total population of countries found
        html += `<p>Total countries population: ${totalPopulation.toLocaleString()}</p>`;

        // Add average population of countries found
        html += `<p>Average population: ${Math.floor(totalPopulation / searchResults.length).toLocaleString()}</p>`;

        // Add table detailing population per country
        html += getCountriesStatisticsTable(searchResults,searchType);

        // Add line break for display
        html += "<br>";

        // Add table detailing amount of countries per region
        html += getRegionsTable(searchResults);

        // Add line break for display
        html += "<br>";

        // Add table detailing amount of countries per currency
        html += getCurrenciesTable(searchResults);

        // Display search results on HTML page
        displayObj.innerHTML = html;
    }

    /* Function to calculate the total population of a collection of countries */
    /* Parameter: countriesList - a collection of country objects */
    /* Returns: Sum of populations of countries */
    function sumTotalPopulation(countriesList) {
        // Initialise total population counter as 0
        let totalPopulation = 0;

        // Iterate over the list of countries and sum the total population of each one
        for (const country of countriesList) totalPopulation += country.population;

        return totalPopulation;

    }

    /* Function to get a table detailing a country and statistics about it - population per documentation and currency(ies) per bonus */
    /* Parameter: countriesList - a collection of country objects  */
    /* Parameter: nameDisplay - which name to show in table */
    /* Returns: HTML code - A detailed table with each row showing country name, population, and currency(ies) used */
    function getCountriesStatisticsTable(countriesList,nameDisplay) {
        // Initialise HTML string with opening table tag, table header, and opening table body tag
        let htmlTable = `<table>
                            <thead>
                                <th>Country name</th>
                                <th>Population</th>
                                <th>Currency(ies)</th>
                            </thead>
                            <tbody>`;

        // Iterate  over list of countries and add table row for each one
        for (const country of countriesList) {
            htmlTable += `<tr>
                            <td>${eval(`country.name.${nameDisplay}`)}</td>
                            <td>${country.population.toLocaleString()}</td>
                            <td>${getCurrenciesOfCountry(country).join(", ")}</td>
                        </tr>`;
        }

        //Close table body tag and table tag
        htmlTable += `</tbody>
                    </table>`;

        return htmlTable;
    }

    /* Function to get an array of currencies of a country */
    /* Parameter: country - a country object */
    /* Returns: An array of currencies of the country */
    function getCurrenciesOfCountry(country) {
        // Initialise currenciesArr variable as an array with one item with a default value
            // for cases where the API doesn't hold information for currencies field (such as Antarctica)
            let currenciesArr = ["No currency used"];
            
            // Make sure there exists a currencies field for country (not all have)
            // If there is, save currencies to array variable
            // We are using the array format for cases where there is more than one currency (such as Namibia or Cuba)
            if (country.currencies !== undefined) currenciesArr = Object.values(country.currencies).map(item => item.name);

            return currenciesArr
    }

    /* Function to get a table showing number of countries per region */
    /* Parameter: countriesList - a collection of country objects */
    /* Returns: HTML code - A table with each row showing region and number of countries in it */
    function getRegionsTable(countriesList) {
        // Initialise HTML string with opening table tag, table header, and opening table body tag
        let htmlTable = `<table>
                            <thead>
                                <th>Region</th>
                                <th>Number of countries</th>
                            </thead>
                            <tbody>`;

        // Initialise empty map to save number of countries (value) per region (key)
        let regions = new Map();

        // Iterate over list of countries and count amount in each region
        for (const country of countriesList) {
            // Initialise countries amount as none
            let countriesAmount = 0;

            // Check if regions map includes the region of the currently iterated country
            // and if so, set countries amount as the number saved in the map
            if (regions.has(country.region)) countriesAmount = regions.get(country.region);

            // Add one to the current value in map of the currently iterated region and save in map
            regions.set(country.region, countriesAmount + 1);
        }

        // Iterate over regions in map and add table row for each one
        for (const region of regions.keys()) {
            htmlTable += `<tr>
                            <td>${region}</td>
                            <td>${regions.get(region)}</td>
                        </tr>`;
        }

        //Close table body tag and table tag
        htmlTable += `</tbody>
                    </table>`;

        
        return htmlTable;
    }

    /* Function to get a table showing number of countries using each currency */
    /* Parameter: countriesList - a collection of country objects */
    /* Returns: HTML code - A table with each row showing currency and number of countries using it */
    function getCurrenciesTable(countriesList) {
        // Initialise HTML string with opening table tag, table header, and opening table body tag
        let htmlTable = `<table>
                            <thead>
                                <th>Currency</th>
                                <th>Number of countries</th>
                            </thead>
                            <tbody>`;

        // Initialise empty map to save number of countries (value) per currency (key)
        let currencies = new Map();

        // Iterate over list of countries and count amount in each currency
        for (const country of countriesList) {
            // Iterate over currencies of the country iterated
            for (const currency of getCurrenciesOfCountry(country)) {
                // Initialise countries amount as none
                let countriesAmount = 0;

                // Check if currencies map includes the currency of the currently iterated country and currency
                // and if so, set countries amount as the number saved in the map
                if (currencies.has(currency)) countriesAmount = currencies.get(currency);

                // Add one to the current value in map of the currently iterated currency and country and save in map
                currencies.set(currency, countriesAmount + 1);
            }
        }

        // Iterate over currencies in map and add table row for each one
        for (const currency of currencies.keys()) {
            htmlTable += `<tr>
                            <td>${currency}</td>
                            <td>${currencies.get(currency)}</td>
                        </tr>`;
        }

        //Close table body tag and table tag
        htmlTable += `</tbody>
                    </table>`;

        
        return htmlTable;
    }
})()