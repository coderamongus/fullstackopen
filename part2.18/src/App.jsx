import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => {
      setCountries(response.data);
    });
  }, []);

  const handleFilterChange = (event) => setFilter(event.target.value);

  const handleShowCountry = (country) => setSelectedCountry(country);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Country Information</h1>
      <input value={filter} onChange={handleFilterChange} placeholder="Search for a country" />

      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Population: {selectedCountry.population}</p>
          <p>Languages: {Object.values(selectedCountry.languages).join(', ')}</p>
          <img src={selectedCountry.flags.png} alt={`Flag of ${selectedCountry.name.common}`} width="150" />
          <button onClick={() => setSelectedCountry(null)}>Back</button>
        </div>
      ) : (
        filteredCountries.length > 10 ? (
          <p>Too many matches, please specify another filter</p>
        ) : filteredCountries.length === 1 ? (
          <div>
            <h2>{filteredCountries[0].name.common}</h2>
            <p>Capital: {filteredCountries[0].capital}</p>
            <p>Population: {filteredCountries[0].population}</p>
            <p>Languages: {Object.values(filteredCountries[0].languages).join(', ')}</p>
            <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} width="150" />
          </div>
        ) : (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleShowCountry(country)}>Show</button>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default App;
