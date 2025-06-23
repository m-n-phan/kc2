import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { format, parseISO } from 'date-fns'
import { KpiTile } from '../components/KpiTile'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { TrendingUp, Users, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react'
import { useCompletionTrends } from '../hooks/useCompletionTrends'

export const Dashboard: React.FC = () => {
  const { data: completionTrends = [], isLoading: trendsLoading } = useCompletionTrends()
  return (
    <div className="space-y-section">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 text-charcoal mb-2">Dashboard</h1>
        <p className="text-slate-600">Current training & compliance snapshot</p>
      </div>

      {/* KPI Tiles Grid */}
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 xl:gap-4">
          <KpiTile
            title="Training Completion"
            value="94%"
            change="+5%"
            trend="up"
          />
          <KpiTile
            title="Safety Score"
            value="98.2"
            change="+1.5"
            trend="up"
          />
          <KpiTile
            title="Checklist Compliance"
            value="89%"
            change="-2%"
            trend="down"
          />
          <KpiTile
            title="Active Staff"
            value="156"
            change="+8"
            trend="up"
          />
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h2">Recent Activity</h2>
              <button className="flex items-center gap-1 pr-2 text-slate-600 hover:text-brand-orange text-sm transition-colors">
                See all Activity
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Food Safety Training completed</p>
                  <p className="text-xs text-slate-500">by Marcus Chen • 2 hours ago</p>
                </div>
                <Badge variant="success" className="inline-flex items-center h-5 px-2">Completed</Badge>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Kitchen Deep Clean checklist</p>
                  <p className="text-xs text-slate-500">overdue • Station 3</p>
                </div>
                <Badge variant="warning" className="inline-flex items-center h-5 px-2">Overdue</Badge>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New team member added</p>
                  <p className="text-xs text-slate-500">Emma Rodriguez • Kitchen Assistant</p>
                </div>
                <Badge variant="default" className="inline-flex items-center h-5 px-2">New</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6">
            <h2 className="text-h2 mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              <button className="w-full flex items-center px-4 py-2 text-left rounded border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-colors">
                <TrendingUp className="w-4 h-4 mr-3 text-slate-500" />
                <span className="text-slate-700">View Reports</span>
              </button>
              
              <button className="w-full flex items-center px-4 py-2 text-left rounded border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-colors">
                <CheckCircle className="w-4 h-4 mr-3 text-slate-500" />
                <span className="text-slate-700">Create Checklist</span>
              </button>
              
              <button className="w-full flex items-center px-4 py-2 text-left rounded border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-colors">
                <Users className="w-4 h-4 mr-3 text-slate-500" />
                <span className="text-slate-700">Assign Training</span>
              </button>
            </div>
          </div>
        </Card>
      </div>

        {/* Performance Trends */}
        <Card className="border-dashed">
          <div className="p-6 md:p-8">
            <h2 className="text-h2 mb-4">Performance Trends</h2>
            <div className="h-64 bg-slate-50 rounded-md">
              {trendsLoading ? (
                <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={completionTrends} margin={{ left: 8, right: 8, top: 16, bottom: 8 }}>
                    <defs>
                      <linearGradient id="trendColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={d => format(parseISO(d), 'MMM')}
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip labelFormatter={d => format(parseISO(String(d)), 'MMM yyyy')} />
                    <Area
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#0ea5e9"
                      fill="url(#trendColor)"
                      strokeWidth={2}
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </Card>
    </div>
  )
} 
