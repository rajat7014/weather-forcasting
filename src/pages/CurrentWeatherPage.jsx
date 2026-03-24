import { useEffect, useMemo, useState } from 'react'
import MetricCard from '../components/MetricCard'
import WeatherChart from '../components/WeatherChart'
import useGeolocation from '../hooks/useGeolocation'
import { fetchCurrentAndHourly } from '../services/openMeteo'
import { formatTime, todayISO } from '../utils/date'

const firstValue = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : null)

export default function CurrentWeatherPage() {
  const { location, isLoading: isLocating, error: locationError } = useGeolocation()
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [unit, setUnit] = useState('C')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return
    const run = async () => {
      setIsLoading(true)
      setError('')
      try {
        const result = await fetchCurrentAndHourly({ ...location, date: selectedDate })
        setData(result)
      } catch {
        setError('Unable to load weather data.')
      } finally {
        setIsLoading(false)
      }
    }
    run()
  }, [location, selectedDate])

  const hourly = data?.weather?.hourly || {}
  const daily = data?.weather?.daily || {}
  const airHourly = data?.air?.hourly || {}
  const times = hourly.time?.map((t) => formatTime(t)) || []

  const temperatureSeries = useMemo(() => {
    const source = hourly.temperature_2m || []
    const values = unit === 'F' ? source.map((v) => (v * 9) / 5 + 32) : source
    return [{ name: `Temperature (°${unit})`, data: values }]
  }, [hourly.temperature_2m, unit])

  const currentTempC = data?.weather?.current?.temperature_2m
  const currentTemp = unit === 'F' && currentTempC != null ? (currentTempC * 9) / 5 + 32 : currentTempC
  const minTempC = firstValue(daily.temperature_2m_min)
  const maxTempC = firstValue(daily.temperature_2m_max)
  const minTemp = unit === 'F' && minTempC != null ? (minTempC * 9) / 5 + 32 : minTempC
  const maxTemp = unit === 'F' && maxTempC != null ? (maxTempC * 9) / 5 + 32 : maxTempC

  return (
    <div className="stack">
      <section className="panel">
        <div className="controls">
          <label>
            Date:
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </label>
          <label>
            Unit:
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="C">Celsius</option>
              <option value="F">Fahrenheit</option>
            </select>
          </label>
        </div>

        {locationError ? <p className="hint">{locationError}</p> : null}
        {isLocating || isLoading ? <p className="hint">Loading weather data...</p> : null}
        {error ? <p className="hint error">{error}</p> : null}
      </section>

      {data ? (
        <>
          <section className="metric-grid">
            <MetricCard title="Temperature (Current)" value={currentTemp?.toFixed(1) ?? '-'} unit={` °${unit}`} />
            <MetricCard title="Temperature (Min)" value={minTemp?.toFixed(1) ?? '-'} unit={` °${unit}`} />
            <MetricCard title="Temperature (Max)" value={maxTemp?.toFixed(1) ?? '-'} unit={` °${unit}`} />
            <MetricCard title="Precipitation" value={data.weather.current?.precipitation ?? '-'} unit=" mm" />
            <MetricCard
              title="Relative Humidity"
              value={data.weather.current?.relative_humidity_2m ?? '-'}
              unit=" %"
            />
            <MetricCard title="UV Index (Max)" value={firstValue(daily.uv_index_max) ?? '-'} />
            <MetricCard title="Sunrise" value={formatTime(firstValue(daily.sunrise))} />
            <MetricCard title="Sunset" value={formatTime(firstValue(daily.sunset))} />
            <MetricCard title="Max Wind Speed" value={firstValue(daily.wind_speed_10m_max) ?? '-'} unit=" km/h" />
            <MetricCard
              title="Precipitation Probability Max"
              value={firstValue(daily.precipitation_probability_max) ?? '-'}
              unit=" %"
            />
            <MetricCard title="Air Quality Index" value={firstValue(airHourly.us_aqi) ?? '-'} />
            <MetricCard title="PM10" value={firstValue(airHourly.pm10) ?? '-'} unit=" ug/m3" />
            <MetricCard title="PM2.5" value={firstValue(airHourly.pm2_5) ?? '-'} unit=" ug/m3" />
            <MetricCard title="CO" value={firstValue(airHourly.carbon_monoxide) ?? '-'} unit=" ug/m3" />
            <MetricCard title="CO2" value="N/A" note="Open-Meteo does not provide CO2 in this endpoint." />
            <MetricCard title="NO2" value={firstValue(airHourly.nitrogen_dioxide) ?? '-'} unit=" ug/m3" />
            <MetricCard title="SO2" value={firstValue(airHourly.sulphur_dioxide) ?? '-'} unit=" ug/m3" />
          </section>

          <WeatherChart title="Temperature" categories={times} series={temperatureSeries} yAxisLabel={`°${unit}`} />
          <WeatherChart
            title="Relative Humidity"
            categories={times}
            series={[{ name: 'Relative Humidity (%)', data: hourly.relative_humidity_2m || [] }]}
            yAxisLabel="%"
          />
          <WeatherChart
            title="Precipitation"
            categories={times}
            series={[{ name: 'Precipitation (mm)', data: hourly.precipitation || [] }]}
            yAxisLabel="mm"
          />
          <WeatherChart
            title="Visibility"
            categories={times}
            series={[{ name: 'Visibility (m)', data: hourly.visibility || [] }]}
            yAxisLabel="m"
          />
          <WeatherChart
            title="Wind Speed (10m)"
            categories={times}
            series={[{ name: 'Wind Speed (km/h)', data: hourly.wind_speed_10m || [] }]}
            yAxisLabel="km/h"
          />
          <WeatherChart
            title="PM10 & PM2.5"
            categories={times}
            series={[
              { name: 'PM10', data: airHourly.pm10 || [] },
              { name: 'PM2.5', data: airHourly.pm2_5 || [] },
            ]}
            yAxisLabel="ug/m3"
          />
        </>
      ) : null}
    </div>
  )
}
