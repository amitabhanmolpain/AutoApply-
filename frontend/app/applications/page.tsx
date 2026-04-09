'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Search, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const applications = [
    { id: 1, company: 'Google', position: 'Senior Software Engineer', platform: 'LinkedIn', icon: '💼', status: 'accepted', date: '2024-01-15' },
    { id: 2, company: 'Microsoft', position: 'Product Manager', platform: 'Indeed', icon: '🔍', status: 'pending', date: '2024-01-14' },
    { id: 3, company: 'Amazon', position: 'Data Scientist', platform: 'Glassdoor', icon: '💬', status: 'rejected', date: '2024-01-13' },
    { id: 4, company: 'Meta', position: 'Full Stack Engineer', platform: 'ZipRecruiter', icon: '📝', status: 'accepted', date: '2024-01-12' },
    { id: 5, company: 'Apple', position: 'DevOps Engineer', platform: 'Monster', icon: '👾', status: 'pending', date: '2024-01-11' },
    { id: 6, company: 'Netflix', position: 'Backend Engineer', platform: 'Dice', icon: '🎯', status: 'accepted', date: '2024-01-10' },
    { id: 7, company: 'Tesla', position: 'ML Engineer', platform: 'LinkedIn', icon: '💼', status: 'rejected', date: '2024-01-09' },
    { id: 8, company: 'Stripe', position: 'Software Engineer', platform: 'Indeed', icon: '🔍', status: 'pending', date: '2024-01-08' },
    { id: 9, company: 'Airbnb', position: 'Frontend Engineer', platform: 'Glassdoor', icon: '💬', status: 'accepted', date: '2024-01-07' },
    { id: 10, company: 'Uber', position: 'Systems Engineer', platform: 'LinkedIn', icon: '💼', status: 'pending', date: '2024-01-06' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/30';
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              <span className="gradient-text">My Applications</span>
            </h1>
            <p className="text-xl text-gray-300">
              View and manage all your job applications in one place
            </p>
          </div>

          {/* Search and Filter */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-input border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-input border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="glassmorphism rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-gradient-to-r from-white/5 to-white/1">
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Company</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Position</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Platform</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <tr
                      key={app.id}
                      className="border-b border-white/5 hover:bg-gradient-to-r hover:from-white/8 hover:to-white/3 transition-all duration-300"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{app.company}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{app.position}</td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-lg">{app.icon}</span>
                          <span className="text-sm text-gray-300 font-medium">{app.platform}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          <span className="capitalize font-medium">{app.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-lg">No applications found</p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Total Applications */}
            <div className="group relative h-full rounded-xl overflow-hidden transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
              <div className={`absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
              <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 blur-2xl"></div>
              </div>
              <div className="relative z-10 p-8 text-center h-full flex flex-col justify-center">
                <p className="text-gray-300 text-sm mb-3 group-hover:text-gray-100 transition-colors duration-300">Total Applications</p>
                <p className="text-5xl font-bold text-cyan-400 group-hover:text-cyan-200 group-hover:scale-110 transition-all origin-center duration-300">{applications.length}</p>
              </div>
            </div>

            {/* Accepted */}
            <div className="group relative h-full rounded-xl overflow-hidden transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
              <div className={`absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
              <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 blur-2xl"></div>
              </div>
              <div className="relative z-10 p-8 text-center h-full flex flex-col justify-center">
                <p className="text-gray-300 text-sm mb-3 group-hover:text-gray-100 transition-colors duration-300">Accepted</p>
                <p className="text-5xl font-bold text-green-400 group-hover:text-green-200 group-hover:scale-110 transition-all origin-center duration-300">
                  {applications.filter((a) => a.status === 'accepted').length}
                </p>
              </div>
            </div>

            {/* Rejected */}
            <div className="group relative h-full rounded-xl overflow-hidden transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
              <div className={`absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20 opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
              <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 blur-2xl"></div>
              </div>
              <div className="relative z-10 p-8 text-center h-full flex flex-col justify-center">
                <p className="text-gray-300 text-sm mb-3 group-hover:text-gray-100 transition-colors duration-300">Rejected</p>
                <p className="text-5xl font-bold text-red-400 group-hover:text-red-200 group-hover:scale-110 transition-all origin-center duration-300">
                  {applications.filter((a) => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
