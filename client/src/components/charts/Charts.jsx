import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import cn from '../../lib/cn'

const axis = {
  stroke: '#94A3B8',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
}

const grid = { stroke: '#E2E8F0', strokeDasharray: '3 3' }

function ChartTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lift">
      {label && <p className="text-[0.72rem] font-semibold text-ink-900">{label}</p>}
      <ul className="mt-1 space-y-0.5">
        {payload.map((entry) => (
          <li key={entry.dataKey || entry.name} className="flex items-center gap-2 text-[0.75rem] text-slate-600">
            <span className="h-2 w-2 rounded-sm" style={{ background: entry.color || entry.payload?.color }} aria-hidden="true" />
            <span className="capitalize">{entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-ink-900">
              {entry.value}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ChartFrame({ title, description, action, children, className = '', height = 260 }) {
  return (
    <div className={cn('rounded-2xl border border-slate-200/80 bg-white p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[0.95rem] font-semibold text-ink-900">{title}</h3>
          {description && <p className="mt-1 text-[0.78rem] text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5" style={{ height }}>
        {children}
      </div>
    </div>
  )
}

export function TrendChart({ data, series, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="date" {...axis} />
        <YAxis {...axis} width={44} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#CBD5E1' }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ColumnChart({ data, series, suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <XAxis dataKey={data[0]?.hour !== undefined ? 'hour' : 'date'} {...axis} />
        <YAxis {...axis} width={44} />
        <Tooltip content={<ChartTooltip suffix={suffix} />} cursor={{ fill: 'rgba(148,163,184,0.12)' }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={26} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({ data, suffix = '', innerRadius = 58, outerRadius = 84 }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip suffix={suffix} />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-[0.75rem] text-slate-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export const chartColors = {
  brand: '#2F4EDB',
  brandLight: '#6E8FFA',
  emerald: '#10B981',
  fuchsia: '#D946EF',
  sky: '#38BDF8',
  slate: '#94A3B8',
  ember: '#F58220',
}
