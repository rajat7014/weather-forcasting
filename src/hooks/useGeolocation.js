import { useEffect, useState } from 'react'

const DEFAULT_COORDS = { latitude: 28.6139, longitude: 77.209 } // New Delhi fallback

export default function useGeolocation() {
  const [location, setLocation] = useState(DEFAULT_COORDS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported. Using default location.')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
        setIsLoading(false)
      },
      () => {
        setError('Location permission denied. Showing default location.')
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 60000 },
    )
  }, [])

  return { location, isLoading, error }
}
