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

            // Iterate over the countries from API and save to global array
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

        // Get array of search results filtering each country's official name by the searchterm, converting both to lowercase to avoid mismatch due to case differences
        let searchResults = countriesArr.filter(country=>country.name.official.toLowerCase().includes(this.dataset.searchterm.toLowerCase()));

        // Check if no countries were found
        if (searchResults.length === 0) {
            // Display message to user explaining lack of data displayed
            displayObj.innerHTML = "No countries were found matching the search"
            // Exit searchCountries function
            return;
        }

        console.log(searchResults);

        // Initialise HTML info with header
        let html = "<h2>Search results: </h2>";

        // Add number of countries found
        html += `<p>Total countries: ${searchResults.length}</p>`;

        // Save total population as a variable so as to call function once
        let totalPopulation = sumTotalPopulation(searchResults);

        // Add total population of countries found
        html += `<p>Total countries population: ${totalPopulation}</p>`;

        // Add average population of countries found
        html += `<p>Average population: ${Math.floor(totalPopulation / searchResults.length)}</p>`;

        // Add table detailing population per country
        html += getCountryPopulationsTable(searchResults);

        // Display search results on HTML page
        displayObj.innerHTML = html;
    }

    /* Function to calculate the total population of a collection of countries */
    /* Paramater: countriesList - a collection of country objects. The objects need to have a property named "population" */
    /* Returns: Sum of populations of countries */
    function sumTotalPopulation(countriesList) {
        // Initialise total population counter as 0
        let totalPopulation = 0;

        // Iterate over the list of countries and sum the total population of each one
        for (const country of countriesList) totalPopulation += country.population;

        return totalPopulation;

    }

    /* Function to get a table detailing population per country */
    /* Paramater: countriesList - a collection of country objects. The objects need to have a property named "population" */
    /* Returns: HTML code - A detailed table with each row showing country name and population */
    function getCountryPopulationsTable(countriesList) {
        // Initialise HTML string with opening table tag, table header, and opening table body tag
        let htmlTable = `<table>
                            <thead>
                                <th>Country name</th>
                                <th>Population</th>
                            </thead>
                            <tbody>`;

        // Iterate  over list of countries and add table row for each one
        for (const country of countriesList) {
            htmlTable += `<tr>
                            <td>${country.name.official}</td>
                            <td>${country.population}</td>
                        </tr>`;
        }

        //Close table body tag and table tag
        htmlTable += `</tbody>
                    </table>`;

        return htmlTable;
    }
})()