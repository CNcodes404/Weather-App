import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { GlassCard } from '@/components/common/GlassCard'
import { formatHour } from '@/lib/time.utils'
import type { HourlyForecast } from '@/types/weather'
import type { Units } from '@/types/app'

interface HourlyChartProps {
  hourly: HourlyForecast[]
  units: Units
  timezoneOffset: number
}

interface ChartEntry {
  time: string
  temp: number
  rain: number
}

interface TooltipPayload {
  dataKey: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const temp = payload.find((p) => p.dataKey === 'temp')
  const rain = payload.find((p) => p.dataKey === 'rain')
  return (
    <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
      <p className="font-medium mb-1">{label}</p>
      {temp && <p className="text-white/80">{temp.value}°</p>}
      {rain && rain.value > 0 && <p className="text-blue-300">{rain.value}% rain</p>}
    </div>
  )
}

export function HourlyChart({ hourly, units, timezoneOffset }: HourlyChartProps) {
  const tempUnit = units === 'metric' ? '°C' : '°F'

  const data: ChartEntry[] = hourly.slice(0, 8).map((h) => ({
    time: formatHour(h.dt, timezoneOffset),
    temp: Math.round(h.temp),
    rain: Math.round(h.pop * 100),
  }))

  return (
    <GlassCard className="p-4">
      <p className="text-xs text-white/40 uppercase tracking-wide mb-4">24-hour forecast</p>

      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}${tempUnit}`}
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tick={false}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="rain" dataKey="rain" fill="rgba(96,165,250,0.25)" radius={[2, 2, 0, 0]} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: 'white' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
