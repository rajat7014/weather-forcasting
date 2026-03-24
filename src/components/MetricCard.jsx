export default function MetricCard({ title, value, unit = '', note = '' }) {
  return (
    <article className="metric-card">
      <h3>{title}</h3>
      <p>
        {value}
        {unit}
      </p>
      {note ? <small>{note}</small> : null}
    </article>
  )
}
