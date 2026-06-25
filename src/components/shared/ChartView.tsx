import { useEffect, useRef, useState } from 'react'
import type { ChartDataPoint } from '../../types/game'
import './ChartView.css'

type Props = {
  chartType: 'bar' | 'donut'
  title: string
  data: ChartDataPoint[]
  unit?: string
  note?: string
  maxValue?: number
}

const ANIM_MS = 1100

function formatValue(v: number): string {
  return v.toLocaleString('nl-NL', { maximumFractionDigits: 2 })
}

/** Telt van 0 naar target met ease-out, voor het reveal-moment. */
function useCountUp(target: number, durationMs = ANIM_MS): number {
  const [value, setValue] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, durationMs])

  return value
}

/** True zodra het element gemount is — triggert de CSS-groeianimatie. */
function useEntered(): boolean {
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return entered
}

export function ChartView({ chartType, title, data, unit, note, maxValue }: Props) {
  if (chartType === 'donut') {
    return <DonutChart title={title} data={data} unit={unit} note={note} />
  }
  return <BarChart title={title} data={data} unit={unit} note={note} maxValue={maxValue} />
}

function CountUpValue({ value, unit, decimals }: { value: number; unit: string; decimals: number }) {
  const animated = useCountUp(value)
  const display = Math.abs(value - animated) < Math.pow(10, -decimals) ? value : animated
  return (
    <>
      {display < 0 ? '−' : ''}
      {Math.abs(display).toLocaleString('nl-NL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      })}
      <span className="chart-unit">{unit}</span>
    </>
  )
}

function decimalsOf(v: number): number {
  if (Number.isInteger(v)) return 0
  return Math.min(String(v).split('.')[1]?.length ?? 0, 2)
}

function BarChart({ title, data, unit, note, maxValue }: Omit<Props, 'chartType'>) {
  const entered = useEntered()
  // Gemixte eenheden of een toelichting → losse statkaarten i.p.v. gedeelde as
  const hasMixedUnits = data.some(d => d.unit && d.unit !== unit)
  const hasNegative = data.some(d => d.value < 0)

  if (hasMixedUnits || note) {
    return (
      <div className="chart-wrap">
        <div className="chart-title">{title}</div>
        <div className="chart-stat-cards">
          {data.map((d, i) => (
            <div
              key={i}
              className={`chart-stat-card ${d.value < 0 ? 'negative' : hasNegative ? 'positive' : ''}`}
              style={{ animationDelay: `${i * 140}ms` }}
            >
              <div className="chart-stat-value">
                <CountUpValue value={d.value} unit={d.unit ?? unit ?? ''} decimals={decimalsOf(d.value)} />
              </div>
              <div className="chart-stat-label">{d.label}</div>
            </div>
          ))}
        </div>
        {note && <div className="chart-note"><span className="chart-note-mark">→</span> {note}</div>}
      </div>
    )
  }

  const absMax = maxValue ?? Math.max(...data.map(d => Math.abs(d.value)), 1)

  return (
    <div className="chart-wrap">
      <div className="chart-title">{title}</div>
      <div className="chart-bars">
        {data.map((d, i) => {
          const pct = (Math.abs(d.value) / absMax) * 100
          const isMax = Math.abs(d.value) === absMax
          return (
            <div key={i} className="chart-bar-row" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="chart-bar-head">
                <span className="chart-bar-label">{d.label}</span>
                <span className={`chart-bar-value ${isMax ? 'lead' : ''}`}>
                  <CountUpValue value={d.value} unit={unit ?? ''} decimals={decimalsOf(d.value)} />
                </span>
              </div>
              <div className="chart-bar-track">
                <div
                  className={`chart-bar-fill ${isMax ? 'lead' : ''} ${d.value < 0 ? 'negative' : ''}`}
                  style={{
                    width: entered ? `${pct}%` : '0%',
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DonutChart({ title, data, unit, note }: Omit<Props, 'chartType'>) {
  const entered = useEntered()
  const total = data.reduce((s, d) => s + d.value, 0)
  const colors = ['var(--chart-accent)', 'var(--chart-muted)']

  const R = 40
  const circumference = 2 * Math.PI * R
  let offset = 0
  const segments = data.map((d, i) => {
    const fraction = total > 0 ? d.value / total : 0
    const seg = {
      ...d,
      dashArray: `${fraction * circumference} ${circumference}`,
      dashOffset: -offset * circumference,
      color: colors[i % colors.length],
    }
    offset += fraction
    return seg
  })

  const lead = data[0]

  return (
    <div className="chart-wrap">
      <div className="chart-title">{title}</div>
      <div className="chart-donut-wrap">
        <div className="chart-donut-stage">
          <svg viewBox="0 0 100 100" className={`chart-donut-svg ${entered ? 'entered' : ''}`}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="50" cy="50" r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeLinecap="butt"
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
              />
            ))}
          </svg>
          {lead && (
            <div className="chart-donut-center">
              <CountUpValue value={lead.value} unit={unit ?? ''} decimals={decimalsOf(lead.value)} />
            </div>
          )}
        </div>
        <div className="chart-donut-legend">
          {data.map((d, i) => (
            <div key={i} className="chart-legend-row" style={{ animationDelay: `${300 + i * 140}ms` }}>
              <span className="chart-legend-dot" style={{ background: colors[i % colors.length] }} />
              <span className="chart-legend-label">{d.label}</span>
              <span className="chart-legend-value">{formatValue(d.value)}{unit ?? ''}</span>
            </div>
          ))}
        </div>
      </div>
      {note && <div className="chart-note"><span className="chart-note-mark">→</span> {note}</div>}
    </div>
  )
}
