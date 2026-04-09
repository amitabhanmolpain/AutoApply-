'use client'

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { TrendingUp, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react'

interface DashboardSectionProps {
  stats: {
    totalApplications: number
    acceptedJobs: number
    rejectedJobs: number
    pendingJobs: number
  }
  onReset: () => void
}

const CHART_COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981']

// Sample data for bar chart showing applications over time
const barChartData = [
  { day: 'Mon', applications: 3 },
  { day: 'Tue', applications: 5 },
  { day: 'Wed', applications: 4 },
  { day: 'Thu', applications: 6 },
  { day: 'Fri', applications: 6 },
]

export function DashboardSection({ stats, onReset }: DashboardSectionProps) {
  const pieChartData = [
    { name: 'Accepted', value: stats.acceptedJobs, color: '#10B981' },
    { name: 'Rejected', value: stats.rejectedJobs, color: '#EF4444' },
    { name: 'Pending', value: stats.pendingJobs, color: '#F59E0B' },
  ]

  const successRate = stats.totalApplications > 0
    ? Math.round((stats.acceptedJobs / stats.totalApplications) * 100)
    : 0

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Success Banner */}
      <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">Applications Started!</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your resume is being submitted across selected platforms. Monitor your applications below.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Total Applications"
          value={stats.totalApplications}
          color="text-primary"
        />
        <MetricCard
          icon={<CheckCircle className="h-6 w-6" />}
          label="Accepted"
          value={stats.acceptedJobs}
          color="text-green-600 dark:text-green-400"
        />
        <MetricCard
          icon={<XCircle className="h-6 w-6" />}
          label="Rejected"
          value={stats.rejectedJobs}
          color="text-red-600 dark:text-red-400"
        />
        <MetricCard
          icon={<Clock className="h-6 w-6" />}
          label="Pending Review"
          value={stats.pendingJobs}
          color="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Success Rate */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-foreground">Success Rate</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="mb-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500 transition-all duration-500"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.totalApplications > 0
                ? `${stats.acceptedJobs} out of ${stats.totalApplications} applications accepted`
                : 'No applications yet'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">{successRate}%</p>
            <p className="text-sm text-muted-foreground">Acceptance Rate</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground">Applications Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
              <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground" />
              <YAxis stroke="currentColor" className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
              />
              <Bar dataKey="applications" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground">Application Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Status Table */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-foreground">Status Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Count</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Indicator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 text-sm text-foreground font-medium">Accepted</td>
                <td className="px-4 py-3 text-sm text-foreground">{stats.acceptedJobs}</td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {stats.totalApplications > 0
                    ? Math.round((stats.acceptedJobs / stats.totalApplications) * 100)
                    : 0}
                  %
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Active</span>
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 text-sm text-foreground font-medium">Rejected</td>
                <td className="px-4 py-3 text-sm text-foreground">{stats.rejectedJobs}</td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {stats.totalApplications > 0
                    ? Math.round((stats.rejectedJobs / stats.totalApplications) * 100)
                    : 0}
                  %
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 dark:bg-red-950">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-xs font-medium text-red-700 dark:text-red-300">Rejected</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 text-sm text-foreground font-medium">Pending Review</td>
                <td className="px-4 py-3 text-sm text-foreground">{stats.pendingJobs}</td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {stats.totalApplications > 0
                    ? Math.round((stats.pendingJobs / stats.totalApplications) * 100)
                    : 0}
                  %
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 dark:bg-amber-950">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">In Progress</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Application
        </Button>
      </div>
    </main>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className={`mb-4 w-fit rounded-lg bg-primary/10 p-3 ${color}`}>
        {icon}
      </div>
      <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}
