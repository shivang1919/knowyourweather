

import React, { useState, useEffect } from 'react';
import './WeatherApp.css'; // Custom CSS with black and gold theme

const WeatherApp = () => {
  const [activeCity, setActiveCity] = useState('Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState('C'); // Celsius by default
  const [lastUpdated, setLastUpdated] = useState(null);
  const [avgTemp, setAvgTemp] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);

  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata'];

  const getWeatherData = async (city) => {
    const apiKey = '48ed01bb564f5b6a1bebbc4c43c23e08';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      const temperature = data.main.temp - 273.15;

      setWeatherData(data);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());

      const now = new Date();
      const day = now.toISOString().split('T')[0];
      const hourlyTime = now.toISOString();

      const payload = {
        city,
        temperature,
        day,
        hourlyTime,
      };

      try {
        const backendUrl = 'http://localhost:8000/weather';
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to post weather data to backend');
        }

        const backendData = await response.json();
        const { avgTemperature, minTemperature, maxTemperature } = backendData;

        setAvgTemp(avgTemperature);
        setMinTemp(minTemperature);
        setMaxTemp(maxTemperature);
      } catch (err) {
        console.error('Error posting weather data to backend:', err);
      }
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    getWeatherData(activeCity);
    const intervalId = setInterval(() => {
      getWeatherData(activeCity);
    }, 300000);
    return () => clearInterval(intervalId);
  }, [activeCity]);

  const handleTempUnitChange = (unit) => {
    setTempUnit(unit);
  };

  const convertTemperature = (tempK) => {
    if (tempUnit === 'F') {
      return ((tempK - 273.15) * 9/5 + 32).toFixed(2);
    }
    return (tempK - 273.15).toFixed(2);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <section>
      <div className='container'>
        <div className='row mt-5'>
          <div className='col-lg-12 text-center fs-1 fw-bold'>
            <span style={{ color: '#f1c40f' }}>Weather Data</span>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 p-5 text-center'>
            <div className='btn-group'>
              {cities.map((city) => (
                <button
                  key={city}
                  className={`btn btn-outline-dark fw-bold ${activeCity === city ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCity(city);
                    getWeatherData(city);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className='row mb-5'>
          <div className='container p-5 feedback-box'>
            <div className='row'>
              <h3 className='text-center'>
                {activeCity} Weather Data
              </h3>
            </div>

            <div className='row mb-3'>
              <div className='col-lg-12 text-center'>
                <div className='btn-group'>
                  <button
                    className={`btn btn-outline-dark fw-bold ${tempUnit === 'C' ? 'active' : ''}`}
                    onClick={() => handleTempUnitChange('C')}
                  >
                    Celsius
                  </button>
                  <button
                    className={`btn btn-outline-dark fw-bold ${tempUnit === 'F' ? 'active' : ''}`}
                    onClick={() => handleTempUnitChange('F')}
                  >
                    Fahrenheit
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className='alert alert-danger text-center' role='alert'>
                {error}
              </div>
            )}

            {weatherData && (
              <div className='row text-center align-items-center'>
                <div className='col-lg-4'>
                  <div className='border p-3'>
                    <div className='display-6'>
                      <i className='fa-solid fa-temperature-full me-2'></i> 
                      Temperature: {convertTemperature(weatherData.main.temp)}°{tempUnit}
                    </div>
                    <div className='display-6 mt-3'>
                      <i className='fa-solid fa-thermometer-half me-2'></i> 
                      Feels Like: {convertTemperature(weatherData.main.feels_like)}°{tempUnit}
                    </div>
                  </div>
                </div>

                <div className='col-lg-4'>
                  <h2 className='display-5'>
                    <i className='fa-solid fa-cloud me-2'></i> 
                    {weatherData.weather[0].main}
                  </h2>
                </div>

                <div className='col-lg-4'>
                  <div className='border p-3'>
                    <div className='display-6'>
                      <i className='fa-regular fa-clock me-2'></i> 
                      Last Updated: {lastUpdated}
                    </div>
                    <div className='display-6 mt-3'>
                      <i className='fa-regular fa-calendar me-2'></i> 
                      Data Time: {formatTimestamp(weatherData.dt)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {weatherData && (
              <div className='row mt-4'>
                <div className='col-lg-12'>
                  <div className='border p-3' style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                    <div>
                      Average Temperature: {avgTemp !== null ? `${avgTemp.toFixed(2)}°C` : 'N/A'}
                    </div>
                    <div>
                      Min Temperature: {minTemp !== null ? `${minTemp.toFixed(2)}°C` : 'N/A'}
                    </div>
                    <div>
                      Max Temperature: {maxTemp !== null ? `${maxTemp.toFixed(2)}°C` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherApp;
