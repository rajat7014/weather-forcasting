const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast'
const WEATHER_ARCHIVE_BASE = 'https://archive-api.open-meteo.com/v1/archive'
const AIR_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const buildUrl = (base, params) => {
  const url = new URL(base)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  return url.toString()
}

const fetchJson = async (url) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed API request: ${response.status}`)
  return response.json()
}

const aggregateHourlyMeansByDate = (hourly) => {
  const times = hourly?.time || []
  const pm10 = hourly?.pm10 || []
  const pm25 = hourly?.pm2_5 || []
  const byDay = new Map()

  for (let i = 0; i < times.length; i += 1) {
    const day = String(times[i]).slice(0, 10)
    const state = byDay.get(day) || { pm10Sum: 0, pm10Count: 0, pm25Sum: 0, pm25Count: 0 }
    const p10 = pm10[i]
    const p25 = pm25[i]

    if (typeof p10 === 'number') {
      state.pm10Sum += p10
      state.pm10Count += 1
    }
    if (typeof p25 === 'number') {
      state.pm25Sum += p25
      state.pm25Count += 1
    }

    byDay.set(day, state)
  }

  const time = []
  const pm10_mean = []
  const pm2_5_mean = []
  ;[...byDay.keys()].sort().forEach((day) => {
    const dayData = byDay.get(day)
    time.push(day)
    pm10_mean.push(dayData.pm10Count ? dayData.pm10Sum / dayData.pm10Count : null)
    pm2_5_mean.push(dayData.pm25Count ? dayData.pm25Sum / dayData.pm25Count : null)
  })

  return { time, pm10_mean, pm2_5_mean }
}

export const fetchCurrentAndHourly = async ({ latitude, longitude, date }) => {
  const weatherUrl = buildUrl(WEATHER_BASE, {
    latitude,
    longitude,
    timezone: 'auto',
    start_date: date,
    end_date: date,
    current: ['temperature_2m', 'relative_humidity_2m', 'precipitation', 'wind_speed_10m'].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation',
      'visibility',
      'wind_speed_10m',
      'precipitation_probability',
      'uv_index',
    ].join(','),
    daily: [
      'temperature_2m_min',
      'temperature_2m_max',
      'sunrise',
      'sunset',
      'wind_speed_10m_max',
      'precipitation_probability_max',
      'uv_index_max',
    ].join(','),
  })

  const airUrl = buildUrl(AIR_BASE, {
    latitude,
    longitude,
    timezone: 'auto',
    start_date: date,
    end_date: date,
    hourly: [
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
    ].join(','),
  })

  const [weather, air] = await Promise.all([fetchJson(weatherUrl), fetchJson(airUrl)])
  return { weather, air }
}

export const fetchHistoricalRange = async ({ latitude, longitude, startDate, endDate }) => {
  const weatherUrl = buildUrl(WEATHER_ARCHIVE_BASE, {
    latitude,
    longitude,
    timezone: 'auto',
    start_date: startDate,
    end_date: endDate,
    daily: [
      'temperature_2m_mean',
      'temperature_2m_min',
      'temperature_2m_max',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
  })

  const airUrl = buildUrl(AIR_BASE, {
    latitude,
    longitude,
    timezone: 'auto',
    start_date: startDate,
    end_date: endDate,
    hourly: 'pm10,pm2_5',
  })

  const [weather, air] = await Promise.all([fetchJson(weatherUrl), fetchJson(airUrl)])
  const airDaily = aggregateHourlyMeansByDate(air.hourly)
  return { weather, air, airDaily }
}
