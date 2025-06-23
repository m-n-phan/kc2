import React from 'react'
import { Card, KpiTile } from '../components'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const incidentData = [
  { day: 'Mon', count: 1 },
  { day: 'Tue', count: 0 },
  { day: 'Wed', count: 3 },
  { day: 'Thu', count: 2 },
  { day: 'Fri', count: 1 },
  { day: 'Sat', count: 0 },
  { day: 'Sun', count: 0 }
]

export const Reports: React.FC = () => {
  return (
    <div className="space-y-section">
      <div>
        <h1 className="text-h1 text-charcoal mb-2">Reports</h1>
        <p className="text-slate-600">Detailed metrics and compliance history</p>
      </div>

      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 xl:gap-4">
          <KpiTile title="Incident Reports" value="3" change="-40%" trend="down" />
          <KpiTile title="Average Score" value="92%" change="+2%" trend="up" />
          <KpiTile title="Open Tasks" value="7" change="+1" trend="up" />
        </div>
      </div>

      <Card>
        <div className="p-6 md:p-8">
          <h2 className="text-h2 mb-4">Incidents This Week</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentData} margin={{ left: 8, right: 16 }}>
                <XAxis dataKey="day" stroke="#475569" />
                <YAxis allowDecimals={false} stroke="#475569" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="border-dashed">
        <div className="p-6">
          <h2 className="text-h2 mb-4">Recent Reports</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex justify-between">
              <span>Slip in kitchen</span>
              <span className="text-slate-500">2 days ago</span>
            </li>
            <li className="flex justify-between">
              <span>Incorrect storage temperature</span>
              <span className="text-slate-500">4 days ago</span>
            </li>
            <li className="flex justify-between">
              <span>Equipment inspection passed</span>
              <span className="text-slate-500">1 week ago</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
