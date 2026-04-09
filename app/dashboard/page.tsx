'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, Rocket, Settings, TrendingUp, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  const dashboardItems = [
    {
      icon: FileText,
      title: 'Setup Your Profile',
      description: 'Upload resume and configure job preferences for AutoApply',
      href: '/setup',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Rocket,
      title: 'Start Auto Apply',
      description: 'Launch automated job applications across all platforms',
      href: '/setup',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into applications and success metrics',
      href: '/analytics',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'My Applications',
      description: 'Browse and manage all your submitted applications',
      href: '/applications',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Welcome to AutoApply</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Start your automated job application journey. Setup your profile, launch applications, and track success in real-time with advanced analytics.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {dashboardItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <div className={`absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    <div className="text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors">
                      Get Started →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="glassmorphism p-8 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Your Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group p-4 rounded-lg border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                <div className="text-3xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform origin-left">0</div>
                <div className="text-sm text-gray-400">Applications</div>
              </div>
              <div className="group p-4 rounded-lg border border-white/10 group-hover:border-green-500/30 transition-colors">
                <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform origin-left">0</div>
                <div className="text-sm text-gray-400">Accepted</div>
              </div>
              <div className="group p-4 rounded-lg border border-white/10 group-hover:border-red-500/30 transition-colors">
                <div className="text-3xl font-bold text-red-400 mb-2 group-hover:scale-110 transition-transform origin-left">0</div>
                <div className="text-sm text-gray-400">Rejected</div>
              </div>
              <div className="group p-4 rounded-lg border border-white/10 group-hover:border-yellow-500/30 transition-colors">
                <div className="text-3xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform origin-left">0</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
