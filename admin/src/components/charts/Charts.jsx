import {
  Area, AreaChart, Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { cn } from '../../lib/utils'

const axis = { stroke: '#8494ac', fontSize: 11, tickLine: false, axisLine: false }

function ChartTooltip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 shadow-lift">
      {label && <p className="text-[0.72rem] font-semibold text-ink-900">{label}</p>}
      <ul className="mt-1 space-y-0.5">
        {payload.map((entry) => (
          <li key={entry.dataKey || entry.name} className="flex items-center gap-2 text-[0.74rem] text-slate-600">
            <span className="h-2 w-2 rounded-sm" style={{ background: entry.color || entry.payload?.color }} aria-hidden="true" />
            <span className="capitalize">{entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-ink-900">{prefix}{entry.value}{suffix}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ChartFrame({ title, description, action, children, className = '', height = 260 }) {
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[0.92rem] font-semibold text-ink-900">{title}</h3>
          {description && <p className="mt-1 text-[0.76rem] text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5" style={{ height }}>{children}</div>
    </div>
  )
}

export function TrendChart({ data, series, prefix = '', suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`ag-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="date" {...axis} />
        <YAxis {...axis} width={46} />
        <Tooltip content={<ChartTooltip prefix={prefix} suffix={suffix} />} cursor={{ stroke: '#3a665a' }} />
        {series.map((s) => (
          <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} fill={`url(#ag-${s.key})`} dot={false} activeDot={{ r: 4 }} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ColumnChart({ data, series, xKey = 'date', suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} width={46} />
        <Tooltip content={<ChartTooltip suffix={suffix} />} cursor={{ fill: 'rgba(148,163,184,0.12)' }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function LineSeriesChart({ data, series }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <XAxis dataKey="date" {...axis} />
        <YAxis {...axis} width={46} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#3a665a' }} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[0.74rem] text-slate-600">{v}</span>} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({ data, prefix = '', suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={82} paddingAngle={2} stroke="none">
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip prefix={prefix} suffix={suffix} />} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(v) => <span className="text-[0.74rem] text-slate-600">{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export const chartColors = {
  brand: '#0066FF',
  brandLight: '#3D8BFF',
  brandPale: '#7AABFF',
  emerald: '#FF7A00',
  amber: '#fbbf24',
  rose: '#fb7185',
  fuchsia: '#c084fc',
  sky: '#60a5fa',
  slate: '#8494ac',
}
