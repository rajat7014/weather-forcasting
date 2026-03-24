import { lazy, Suspense } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

const CurrentWeatherPage = lazy(() => import('./pages/CurrentWeatherPage'))
const HistoricalPage = lazy(() => import('./pages/HistoricalPage'))

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Weather Insights Dashboard</h1>
        <p>Real-time + historical weather analytics with Open-Meteo</p>
      </header>

      <nav className="top-nav">
        <NavLink to="/" end>
          Current & Hourly
        </NavLink>
        <NavLink to="/historical">Historical Trends</NavLink>
      </nav>

      <main className="page-content">
        <Suspense fallback={<p className="hint">Loading page...</p>}>
          <Routes>
            <Route path="/" element={<CurrentWeatherPage />} />
            <Route path="/historical" element={<HistoricalPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
