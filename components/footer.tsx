'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 glassmorphism py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">JobBot</span>
            </div>
            <p className="text-gray-400 text-sm">
              Automate your job applications and land your dream role faster.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/analytics" className="hover:text-purple-400 transition-colors">Analytics</Link></li>
              <li><Link href="/applications" className="hover:text-purple-400 transition-colors">Applications</Link></li>
              <li><Link href="/setup" className="hover:text-purple-400 transition-colors">Setup</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} JobBot. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-purple-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-purple-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-purple-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
