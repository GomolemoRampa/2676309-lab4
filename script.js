const searchInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfoSection = document.getElementById('country-info');
const borderingCountriesSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

function hideAllSections() {
    countryInfoSection.classList.add('hidden');
    borderingCountriesSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

async function searchCountry(countryName) {
    if (!countryName) return;

    try {
        hideAllSections();
        loadingSpinner.classList.remove('hidden');

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error('Country not found. Please try another name.');
        }

        const data = await response.json();
        const country = data[0];
        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" style="max-width: 200px; border: 1px solid #ccc;">
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
        `;
        countryInfoSection.classList.remove('hidden');

        if (country.borders && country.borders.length > 0) {
            const bordersResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`);
            const bordersData = await bordersResponse.json();

            let bordersHTML = '<h3>Bordering Countries:</h3><div class="border-grid">';
            
            bordersData.forEach(borderCountry => {
                bordersHTML += `
                    <div class="border-item" style="text-align: center;">
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" style="width: 100%; max-width: 100px; border: 1px solid #ccc;">
                        <p style="font-size: 0.9em; margin-top: 5px;">${borderCountry.name.common}</p>
                    </div>
                `;
            });
            bordersHTML += '</div>';

            borderingCountriesSection.innerHTML = bordersHTML;
            borderingCountriesSection.classList.remove('hidden');
        } else {
            borderingCountriesSection.innerHTML = '<p>No bordering countries.</p>';
            borderingCountriesSection.classList.remove('hidden');
        }

    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

searchBtn.addEventListener('click', () => {
    const country = searchInput.value.trim();
    searchCountry(country);
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const country = searchInput.value.trim();
        searchCountry(country);
    }
});

hideAllSections();
loadingSpinner.classList.add('hidden');