export const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString()
}

export const formatTime = (value, timeZone = 'auto') => {
  if (!value) return '-'
  const date = new Date(value)
  const options = { hour: '2-digit', minute: '2-digit' }
  if (timeZone !== 'auto') options.timeZone = timeZone
  return date.toLocaleTimeString([], options)
}

export const toIstTime = (value) => formatTime(value, 'Asia/Kolkata')

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const minusDaysISO = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export const getTwoYearsAgoISO = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 2)
  return d.toISOString().slice(0, 10)
}
