'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart, 
  Pie, 
  RadarChart,
  Radar,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, Activity, Zap, Clock } from 'lucide-react';

export default function Analytics() {
  const applicationData = [
    { date: 'Week 1', applications: 12, interviews: 3, offers: 1 },
    { date: 'Week 2', applications: 19, interviews: 5, offers: 2 },
    { date: 'Week 3', applications: 25, interviews: 7, offers: 2 },
    { date: 'Week 4', applications: 32, interviews: 9, offers: 3 },
    { date: 'Week 5', applications: 28, interviews: 8, offers: 2 },
    { date: 'Week 6', applications: 35, interviews: 12, offers: 4 },
  ];

  const hourlyData = [
    { hour: '00', applications: 2 },
    { hour: '04', applications: 5 },
    { hour: '08', applications: 12 },
    { hour: '12', applications: 18 },
    { hour: '16', applications: 15 },
    { hour: '20', applications: 10 },
    { hour: '23', applications: 3 },
  ];

  const statusData = [
    { name: 'Accepted', value: 28, color: '#10b981' },
    { name: 'Rejected', value: 22, color: '#ef4444' },
    { name: 'Interview Scheduled', value: 18, color: '#06b6d4' },
    { name: 'Pending', value: 45, color: '#f59e0b' },
  ];

  const platformData = [
    { platform: 'LinkedIn', value: 35 },
    { platform: 'Indeed', value: 28 },
    { platform: 'Glassdoor', value: 22 },
    { platform: 'ZipRecruiter', value: 18 },
    { platform: 'Monster', value: 15 },
    { platform: 'Dice', value: 12 },
  ];

  const metrics = [
    { label: 'Total Applications', value: '113', icon: Zap, color: 'from-purple-500 to-purple-600', change: '+24%' },
    { label: 'Success Rate', value: '24.8%', icon: TrendingUp, color: 'from-green-500 to-emerald-600', change: '+8%' },
    { label: 'Active Interviews', value: '12', icon: Activity, color: 'from-cyan-500 to-blue-600', change: '+3' },
    { label: 'Avg Response Time', value: '2.3d', icon: Clock, color: 'from-orange-500 to-red-600', change: '-0.5d' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              <span className="gradient-text">Analytics Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300">
              Real-time insights into your job application performance
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="group relative overflow-hidden rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-bold ${metric.change.startsWith('+') && !metric.change.includes('d') ? 'text-green-400' : metric.change.includes('-') ? 'text-green-400' : 'text-cyan-400'}`}>
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Area Chart - Applications Trend */}
            <div className="glassmorphism p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Applications Growth</h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={applicationData}>
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f0f4ff',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="applications" stroke="#7c3aed" fillOpacity={1} fill="url(#colorApplications)" name="Total Apps" />
                  <Area type="monotone" dataKey="interviews" stroke="#06b6d4" fillOpacity={1} fill="url(#colorInterviews)" name="Interviews" />
                  <Area type="monotone" dataKey="offers" stroke="#10b981" fillOpacity={1} fill="url(#colorOffers)" name="Offers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Chart - Status Distribution */}
            <div className="glassmorphism p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Application Status</h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f0f4ff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Hourly Activity */}
            <div className="glassmorphism p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Hourly Activity Pattern</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hour" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f0f4ff',
                    }}
                  />
                  <Bar dataKey="applications" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Distribution */}
            <div className="glassmorphism p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Applications by Platform</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={platformData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#999" />
                  <YAxis dataKey="platform" type="category" stroke="#999" width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f0f4ff',
                    }}
                  />
                  <Bar dataKey="value" fill="#7c3aed" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Summary Table */}
          <div className="mt-8 glassmorphism p-8 rounded-xl border border-white/10 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Status Breakdown</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">Count</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((status, index) => {
                  const total = statusData.reduce((sum, item) => sum + item.value, 0);
                  return (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          ></div>
                          <span className="text-white font-medium">{status.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-white">{status.value}</td>
                      <td className="py-4 px-4 text-right text-white">
                        {((status.value / total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
