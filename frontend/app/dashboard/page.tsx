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
      color: 'from-blue-500 to-cyan-600',
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 mb-6 glassmorphism-sm hover:bg-blue-500/15 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm text-blue-200">Welcome to AutoApply</span>
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
              const gradients = [
                'from-blue-600/20 to-cyan-600/20',
                'from-cyan-600/20 to-blue-600/20',
                'from-blue-500/20 to-purple-600/20',
                'from-purple-600/20 to-blue-500/20',
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group relative h-full rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer"
                >
                  {/* Base background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
                  
                  {/* Animated gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  
                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} blur-2xl`}></div>
                  </div>
                  
                  <div className="relative z-10 h-full p-6 flex flex-col">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 neon-glow-blue`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors duration-300">{item.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 group-hover:text-gray-100 transition-colors duration-300 flex-grow">{item.description}</p>
                    <div className="text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
                      Get Started →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-8">Your Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Applications', value: '0', color: 'cyan', colorClass: 'text-cyan-400', glowColor: 'from-cyan-500' },
                { label: 'Accepted', value: '0', color: 'green', colorClass: 'text-green-400', glowColor: 'from-green-500' },
                { label: 'Rejected', value: '0', color: 'red', colorClass: 'text-red-400', glowColor: 'from-red-500' },
                { label: 'Pending', value: '0', color: 'yellow', colorClass: 'text-yellow-400', glowColor: 'from-yellow-500' },
              ].map((stat, idx) => (
                <div key={idx} className="group relative h-full rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.glowColor} to-transparent blur-xl`}></div>
                  </div>
                  <div className="relative z-10 p-4">
                    <div className={`${stat.colorClass} text-3xl font-bold mb-2 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all duration-300 origin-left`}>{stat.value}</div>
                    <div className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
