import Chart from 'react-apexcharts'

const baseOptions = (title, categories, yAxisLabel) => ({
  chart: {
    id: title.toLowerCase().replace(/\s+/g, '-'),
    toolbar: {
      show: true,
      tools: { zoom: true, zoomin: true, zoomout: true, pan: true, reset: true },
    },
    zoom: { enabled: true },
  },
  xaxis: {
    categories,
    labels: { rotate: -45 },
  },
  yaxis: {
    title: { text: yAxisLabel || '' },
  },
  stroke: { curve: 'smooth', width: 2 },
  dataLabels: { enabled: false },
  legend: { position: 'top' },
  title: { text: title, align: 'left' },
})

export default function WeatherChart({ title, categories, series, yAxisLabel = '' }) {
  return (
    <section className="chart-card">
      <div className="chart-scroll">
        <div className="chart-inner">
          <Chart
            options={baseOptions(title, categories, yAxisLabel)}
            series={series}
            type="line"
            height={320}
            width={Math.max(720, categories.length * 40)}
          />
        </div>
      </div>
    </section>
  )
}
