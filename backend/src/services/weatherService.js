const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  /**
   * Get weather forecast for a specific date and location
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {Date} date - Target date
   * @returns {Promise<Object>} Weather data
   */
  async getForecast(lat, lon, date) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      // Find the forecast closest to the target date
      const targetTimestamp = date.getTime();
      let closestForecast = null;
      let minDiff = Infinity;

      response.data.list.forEach(item => {
        const forecastDate = new Date(item.dt * 1000);
        const diff = Math.abs(forecastDate.getTime() - targetTimestamp);
        
        if (diff < minDiff) {
          minDiff = diff;
          closestForecast = item;
        }
      });

      if (!closestForecast) {
        throw new Error('No forecast data available for the specified date');
      }

      return {
        temperature: closestForecast.main.temp,
        hasRain: closestForecast.weather.some(w => 
          w.main.toLowerCase().includes('rain') || 
          w.description.toLowerCase().includes('rain')
        ),
        description: closestForecast.weather[0].description,
        timestamp: new Date(closestForecast.dt * 1000)
      };
    } catch (error) {
      console.error('Weather API Error:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }

  /**
   * Check if weather conditions are fulfilled
   * @param {Object} weatherData - Actual weather data
   * @param {Object} conditions - Required conditions
   * @returns {boolean} True if conditions are met
   */
  checkConditions(weatherData, conditions) {
    const tempCheck = weatherData.temperature >= conditions.requiredTemp;
    const rainCheck = conditions.noRain ? !weatherData.hasRain : true;
    
    return tempCheck && rainCheck;
  }
}

module.exports = new WeatherService();
