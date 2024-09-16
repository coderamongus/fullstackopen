import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.error('Error fetching country data:', error));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const results = countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCountries(results);
  }, [filter, countries]);

  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter.</p>;
    } else if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
      return (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>{country.name.common}</li>
          ))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital[0]}</p>
          <p>Population: {country.population}</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values(country.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
        </div>
      );
    } else {
      return <p>No matches found.</p>;
    }
  };

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        Find countries: <input value={filter} onChange={handleFilterChange} />
      </div>
      {renderCountries()}
    </div>
  );
};

export default App;
