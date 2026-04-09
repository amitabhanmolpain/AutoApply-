'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target } from 'lucide-react';

export default function Analytics() {
  const applicationData = [
    { date: 'Mon', applications: 12 },
    { date: 'Tue', applications: 19 },
    { date: 'Wed', applications: 15 },
    { date: 'Thu', applications: 25 },
    { date: 'Fri', applications: 22 },
    { date: 'Sat', applications: 18 },
    { date: 'Sun', applications: 14 },
  ];

  const statusData = [
    { name: 'Accepted', value: 18, color: '#10b981' },
    { name: 'Rejected', value: 12, color: '#ef4444' },
    { name: 'Pending', value: 35, color: '#f59e0b' },
  ];

  const metrics = [
    { label: 'Total Applications', value: '65', icon: Target, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Success Rate', value: '27.7%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Response Rate', value: '46%', icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'Rejection Rate', value: '18.5%', icon: TrendingDown, color: 'from-red-500 to-red-600' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-xl text-gray-300">
              Track your job applications and success metrics in real-time
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="glassmorphism p-6 rounded-xl border border-white/10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Bar Chart */}
            <div className="lg:col-span-2 glassmorphism p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Applications This Week</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationData}>
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
                  <Bar dataKey="applications" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="glassmorphism p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Application Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
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

          {/* Status Table */}
          <div className="glassmorphism p-8 rounded-xl border border-white/10 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Status Breakdown</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Count</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((status, index) => (
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
                      {((status.value / 65) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
