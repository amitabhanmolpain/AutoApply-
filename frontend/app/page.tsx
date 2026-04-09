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
    { 
      name: 'LinkedIn', 
      color: 'from-blue-600 to-blue-700', 
      logo: 'https://cdn-icons-png.flaticon.com/512/3536/3536505.png'
    },
    { 
      name: 'Intershala', 
      color: 'from-blue-500 to-cyan-600', 
      logo: 'https://cdn.aptoide.com/imgs/c/3/1/c31c5e531ad94d917080d17066c31470_icon.png'
    },
    { 
      name: 'Wellfound', 
      color: 'from-orange-500 to-red-600', 
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_uvmLprvNSpkN84gOZSYVaGS6iyuiINTGdw&s'
    },
    { 
      name: 'Indeed', 
      color: 'from-blue-600 to-purple-700', 
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThz8Qi-G6jIHt6TmCOguWjOKGYYQPB1afpSQ&s'
    },
    { 
      name: 'Naukri.com', 
      color: 'from-blue-600 to-blue-700', 
      logo: 'https://static.naukimg.com/s/0/0/i/new-logos/naukri.png'
    },
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-600/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-bl from-cyan-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-t from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20 relative overflow-hidden">
        {/* Background gradient - Glassmorphism Blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 glassmorphism-sm hover:bg-blue-500/15 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span className="text-sm text-blue-200">Powered by Advanced AI Technology</span>
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
              className="glass-button px-8 py-4 text-lg inline-flex items-center gap-2"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 md:gap-8">
            <div className="glass-card p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">10K+</div>
              <div className="text-sm text-gray-400">Applications Sent</div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-green-400">2.5K+</div>
              <div className="text-sm text-gray-400">Jobs Filled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Platforms Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-0 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/15 to-purple-600/15 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            <span className="gradient-text">Apply to Leading Platforms</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {jobPlatforms.map((platform) => (
              <div 
                key={platform.name}
                className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Background gradient that moves on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* Border gradient */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
                
                {/* Animated background on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} blur-xl`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="relative w-16 h-16 group-hover:scale-125 transition-all duration-500">
                    <img 
                      src={platform.logo} 
                      alt={platform.name}
                      className="w-full h-full object-contain group-hover:drop-shadow-[0_0_16px_rgba(96,165,250,0.8)] transition-all duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center text-3xl';
                        fallback.textContent = platform.name.charAt(0);
                        e.currentTarget.parentElement?.appendChild(fallback);
                      }}
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-100 group-hover:text-white transition-all duration-300">{platform.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-b from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-t from-cyan-600/15 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            <span className="gradient-text">Why Choose JobBot?</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const gradients = [
                'from-blue-600/20 to-cyan-600/20',
                'from-cyan-600/20 to-blue-600/20',
                'from-blue-500/20 to-purple-600/20',
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <div 
                  key={index}
                  className="group relative h-full rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
                >
                  {/* Base gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
                  
                  {/* Animated gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  
                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-transparent blur-2xl"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full p-8 flex flex-col">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 neon-glow-blue">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-200 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300 flex-grow">{feature.description}</p>
                  </div>
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
                <div className="glass-card p-6 rounded-2xl text-center h-full flex flex-col items-center justify-center hover:bg-white/15 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 neon-glow-cyan">
                    <span className="font-bold text-white text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-500/50" />
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
