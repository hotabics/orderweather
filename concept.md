# OrderWeather

## Team Members
- Member 1 - Jānis 
- Member 2 - Ivo
- Member 3 - Inga

## Project Description
OrderWeather is a simple web app that recommends what to order (meals and drinks) based on current and forecasted weather at your location. It pulls live weather, classifies conditions (hot, cold, rainy, windy), and maps them to curated order ideas (e.g., iced latte, cold salad, ramen, soup). Users can select a city or use geolocation and see suggestions for now and the next few days.

## Problem Statement
Choosing what to order often takes time and the result may not fit the weather (e.g., ordering hot soup on a hot day). OrderWeather helps anyone who orders food or drinks—students, office workers, families—quickly pick weather-appropriate options with minimal decision-making by turning weather data into actionable, curated suggestions.

## API Selection
**API Name:** OpenWeatherMap (Current Weather + 5 Day / 3 Hour Forecast + Geocoding)  
**API Documentation:** https://openweathermap.org/api  
**Why this API?** It offers reliable current and forecast endpoints, a generous free tier, simple geocoding by city name or coordinates, and clear SDK/examples—perfect for a small MVP.

### 2. GitHub Repository

**Required structure for now:**

orderweather/
└── README.md

**README.md should include:**
- Project title: OrderWeather
- Brief description: A web app that recommends food and drink orders based on current and forecasted weather.
- Team members: Jānis, Ivo, Inga
- API being used: OpenWeatherMap (https://openweathermap.org/api)