Weather Forecasting App

A responsive ReactJS-based weather forecasting application that provides real-time and historical weather insights using the Open-Meteo API. The app automatically detects the user's location using browser GPS and displays localized weather data with interactive charts.

🚀 Live Demo

https://weather-forcasting-black.vercel.app/

📌 Features
📍 Auto Location Detection
Uses browser Geolocation API
Fetches weather data based on user's current location
🧭 Pages Overview
1️⃣ Current Weather & Hourly Forecast
🌡️ Weather Metrics
Current Temperature
Min & Max Temperature
Relative Humidity
Precipitation
UV Index
🌅 Sun Cycle
Sunrise
Sunset
🌬️ Wind & Air
Max Wind Speed
Precipitation Probability
🌫️ Air Quality
AQI
PM10, PM2.5
CO, CO₂
NO₂, SO₂
📊 Hourly Charts (Interactive)
Temperature (°C ⇄ °F toggle)
Relative Humidity
Precipitation
Visibility
Wind Speed (10m)
PM10 & PM2.5 (combined chart)


Zoom In / Zoom Out
Horizontal Scrolling
Mobile Responsive
2️⃣ Historical Weather Analysis (Max 2 Years)
📅 Date Range Selection
Users can select custom date ranges (up to 2 years)
📈 Charts & Data
Temperature (Min, Max, Mean)
Sunrise & Sunset (IST)
Precipitation (Total)
Wind Speed & Direction
PM10 & PM2.5 trends
🛠️ Tech Stack
Frontend
React.js (v19)
Vite
React Router DOM
Charts & Visualization
ApexCharts
React-ApexCharts
Styling
CSS / Tailwind (if used)
API
Open-Meteo API
📁 Project Structure
weather-forecasting/
│
├── public/
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── MetricCard.jsx
│   │   └── WeatherChart.jsx
│   │
│   ├── hooks/
│   │   └── useGeolocation.js
│   │
│   ├── pages/
│   │   ├── CurrentWeatherPage.jsx
│   │   └── HistoricalPage.jsx
│   │
│   ├── services/
│   │   └── openMeteo.js
│   │
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/weather-forecasting.git
cd weather-forecasting
2️⃣ Install Dependencies
npm install
3️⃣ Run Development Server
npm run dev
4️⃣ Build for Production
npm run build
⚡ Performance Optimization
Efficient API calls using optimized endpoints
Lazy loading components
Minimal re-renders with React hooks
Fast rendering with Vite

⏱️ Target: < 500ms load time

📱 Responsiveness
Fully mobile-friendly design
Adaptive charts
Flexbox/Grid layout
📊 Chart Features
Interactive tooltips
Zoom & pan
Horizontal scrolling
Dynamic datasets
🔄 Temperature Toggle
Switch between:
Celsius (°C)
Fahrenheit (°F)
🌍 API Integration
Uses Open-Meteo API for:
Current weather
Hourly forecast
Historical data
Air quality data
