'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Rocket } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/setup', label: 'Setup' },
    { href: '/autofill', label: 'Autofill' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/applications', label: 'Applications' },
    { href: '/settings', label: 'Settings' },
  ];

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ease-out ${
      isScrolled
        ? 'mx-4 mt-4 rounded-2xl max-w-[calc(100%-2rem)] left-1/2 -translate-x-1/2 bg-white/5 border-white/20'
        : 'bg-white/5 border-white/10'
    }`}>
      <div className={`transition-all duration-500 ease-out ${isScrolled ? 'px-4 py-3' : 'px-4 sm:px-6 lg:px-8 py-4'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center h-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center neon-glow-blue group-hover:scale-110 transition-transform duration-300">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className={`hidden sm:flex flex-col transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">AutoApply</span>
              <span className="text-xs text-cyan-300/70">Job Automation</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/20 text-blue-200 border border-blue-400/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 hover:border border-transparent hover:border-white/20'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/dashboard" className="gradient-button px-6 py-2 text-sm whitespace-nowrap">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 border-t border-white/10 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
