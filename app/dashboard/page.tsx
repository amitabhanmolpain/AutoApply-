'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, Zap, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  const dashboardItems = [
    {
      icon: FileText,
      title: 'Setup Profile',
      description: 'Upload your resume and configure your job preferences',
      href: '/setup',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Zap,
      title: 'Auto Apply',
      description: 'Start the automated job application process',
      href: '/setup',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: BarChart3,
      title: 'View Analytics',
      description: 'Track your applications and success metrics',
      href: '/analytics',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Manage your preferences and account settings',
      href: '/settings',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your job applications and track your progress with intelligent analytics
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {dashboardItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group glassmorphism p-8 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <div className="text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
                    Get Started →
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="glassmorphism p-8 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">0</div>
                <div className="text-sm text-gray-400">Total Applications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                <div className="text-sm text-gray-400">Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">0</div>
                <div className="text-sm text-gray-400">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">0</div>
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
