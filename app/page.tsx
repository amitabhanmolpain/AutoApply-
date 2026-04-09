'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { 
  Zap, 
  BarChart3, 
  Shield, 
  Rocket, 
  BrainCircuit,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Apply to multiple job positions in seconds with AI-powered automation'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track your applications with detailed charts and real-time statistics'
    },
    {
      icon: BrainCircuit,
      title: 'Smart Matching',
      description: 'AI analyzes your resume and matches it with perfect job opportunities'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties'
    },
    {
      icon: Rocket,
      title: 'Multi-Platform',
      description: 'Apply across LinkedIn, Indeed, Glassdoor, and more simultaneously'
    },
    {
      icon: Sparkles,
      title: 'Intelligent Tracking',
      description: 'Get notifications for rejections and follow-ups automatically'
    },
  ];

  const jobPlatforms = [
    { name: 'LinkedIn', color: 'from-blue-600 to-blue-700', icon: '💼' },
    { name: 'Indeed', color: 'from-blue-500 to-purple-600', icon: '🔍' },
    { name: 'Glassdoor', color: 'from-purple-500 to-pink-600', icon: '💬' },
    { name: 'ZipRecruiter', color: 'from-orange-500 to-red-600', icon: '📝' },
    { name: 'Monster', color: 'from-purple-600 to-blue-700', icon: '👾' },
    { name: 'Dice', color: 'from-red-500 to-orange-600', icon: '🎯' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by Advanced AI Technology</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Land Your Dream Job</span>
            <br />
            <span className="text-white">While We Apply</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            AutoApply intelligently applies to hundreds of jobs across LinkedIn, Indeed, Glassdoor, and more. 
            Upload your resume once and let AI handle the rest while you focus on interviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard" className="gradient-button px-8 py-4 text-lg inline-flex items-center gap-2">
              Start Automating <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 rounded-lg border border-purple-500/30 text-white hover:bg-purple-500/10 transition-all duration-300 font-semibold"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 md:gap-8">
            <div className="glassmorphism p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">10K+</div>
              <div className="text-sm text-gray-400">Applications Sent</div>
            </div>
            <div className="glassmorphism p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="glassmorphism p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-green-400">2.5K+</div>
              <div className="text-sm text-gray-400">Jobs Filled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Platforms Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Apply to All Major Platforms
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {jobPlatforms.map((platform) => (
              <div 
                key={platform.name}
                className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 hover:scale-110 cursor-pointer`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className={`absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors`}></div>
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="text-5xl">{platform.icon}</div>
                  <p className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{platform.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose JobBot?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="glassmorphism p-8 rounded-xl hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Upload Resume', desc: 'Add your resume and profile information' },
              { step: '2', title: 'Set Preferences', desc: 'Choose job titles and platforms' },
              { step: '3', title: 'Auto Apply', desc: 'Let AI apply to matching jobs' },
              { step: '4', title: 'Track Results', desc: 'Monitor your applications in real-time' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="glassmorphism p-6 rounded-lg text-center h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                    <span className="font-bold text-white text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-purple-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-2xl mx-auto text-center glassmorphism p-12 rounded-2xl border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Stop wasting time filling applications. Let JobBot do the heavy lifting while you prepare for interviews.
          </p>
          <Link href="/dashboard" className="gradient-button px-8 py-4 text-lg inline-flex items-center gap-2">
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
