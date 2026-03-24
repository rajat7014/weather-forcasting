import { useEffect, useMemo, useState } from 'react'
import WeatherChart from '../components/WeatherChart'
import useGeolocation from '../hooks/useGeolocation'
import { fetchHistoricalRange } from '../services/openMeteo'
import { getTwoYearsAgoISO, minusDaysISO, toIstTime } from '../utils/date'

const dayMs = 24 * 60 * 60 * 1000
const maxRangeDays = 730

export default function HistoricalPage() {
  const { location } = useGeolocation()
  const [startDate, setStartDate] = useState(minusDaysISO(30))
  const [endDate, setEndDate] = useState(minusDaysISO(1))
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isRangeValid = useMemo(() => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffDays = Math.floor((end - start) / dayMs)
    return diffDays >= 0 && diffDays <= maxRangeDays
  }, [startDate, endDate])

  useEffect(() => {
    if (!location?.latitude || !location?.longitude || !isRangeValid) return
    const run = async () => {
      setIsLoading(true)
      setError('')
      try {
        const result = await fetchHistoricalRange({ ...location, startDate, endDate })
        setData(result)
      } catch {
        setError('Unable to load historical data.')
      } finally {
        setIsLoading(false)
      }
    }
    run()
  }, [location, startDate, endDate, isRangeValid])

  const wDaily = data?.weather?.daily || {}
  const aDaily = data?.airDaily || {}
  const labels = wDaily.time || []

  return (
    <div className="stack">
      <section className="panel">
        <div className="controls">
          <label>
            Start:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={getTwoYearsAgoISO()}
              max={endDate}
            />
          </label>
          <label>
            End:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
          </label>
        </div>
        {!isRangeValid ? <p className="hint error">Date range must be between 0 and 730 days.</p> : null}
        {isLoading ? <p className="hint">Loading historical data...</p> : null}
        {error ? <p className="hint error">{error}</p> : null}
      </section>

      {data ? (
        <>
          <WeatherChart
            title="Temperature (Mean, Max, Min)"
            categories={labels}
            series={[
              { name: 'Mean', data: wDaily.temperature_2m_mean || [] },
              { name: 'Max', data: wDaily.temperature_2m_max || [] },
              { name: 'Min', data: wDaily.temperature_2m_min || [] },
            ]}
            yAxisLabel="°C"
          />
          <WeatherChart
            title="Sunrise & Sunset (IST)"
            categories={labels}
            series={[
              {
                name: 'Sunrise (IST)',
                data: (wDaily.sunrise || []).map((v) => {
                  const parts = toIstTime(v).split(':')
                  const h = Number(parts[0]) || 0
                  const m = Number(parts[1]) || 0
                  return h + m / 60
                }),
              },
              {
                name: 'Sunset (IST)',
                data: (wDaily.sunset || []).map((v) => {
                  const parts = toIstTime(v).split(':')
                  const h = Number(parts[0]) || 0
                  const m = Number(parts[1]) || 0
                  return h + m / 60
                }),
              },
            ]}
            yAxisLabel="Hour of day (IST)"
          />
          <WeatherChart
            title="Precipitation Total"
            categories={labels}
            series={[{ name: 'Precipitation (mm)', data: wDaily.precipitation_sum || [] }]}
            yAxisLabel="mm"
          />
          <WeatherChart
            title="Wind (Max Speed & Dominant Direction)"
            categories={labels}
            series={[
              { name: 'Max Speed (km/h)', data: wDaily.wind_speed_10m_max || [] },
              { name: 'Direction (deg)', data: wDaily.wind_direction_10m_dominant || [] },
            ]}
            yAxisLabel="km/h / degree"
          />
          <WeatherChart
            title="Air Quality PM10 & PM2.5 Trends"
            categories={labels}
            series={[
              { name: 'PM10 Mean', data: aDaily.pm10_mean || [] },
              { name: 'PM2.5 Mean', data: aDaily.pm2_5_mean || [] },
            ]}
            yAxisLabel="ug/m3"
          />
        </>
      ) : null}
    </div>
  )
}
