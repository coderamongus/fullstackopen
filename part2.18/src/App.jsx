import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (capital && api_key) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`;
      axios
        .get(url)
        .then(response => setWeather(response.data))
        .catch(error => console.error('Error fetching weather data:', error));
    }
  }, [capital, api_key]);

  if (!weather) return <p>Loading weather data...</p>;

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
      <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
      <p><strong>Weather:</strong> {weather.weather[0].description}</p>
    </div>
  );
};

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200px" />
      <Weather capital={country.capital} />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching country data:', error));
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
      setSelectedCountry(null);
    }
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1>Country Information</h1>
      <input value={search} onChange={handleSearch} placeholder="Search for a country" />
      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 || selectedCountry ? (
        <Country country={selectedCountry || filteredCountries[0]} />
      ) : (
        filteredCountries.map(country => (
          <div key={country.name.common}>
            <p>{country.name.common}</p>
            <button onClick={() => handleShowCountry(country)}>Show</button>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
