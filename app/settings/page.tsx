'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Bell, Lock, User, Globe, Zap, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    fullName: 'John Doe',
    jobAlerts: true,
    applicationUpdates: true,
    weeklyReports: true,
    twoFactorAuth: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    toast.loading('Saving settings...');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Settings saved successfully!');
    setIsSaving(false);
  };

  const settingsCategories = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information',
      items: [
        { label: 'Full Name', name: 'fullName', type: 'text' },
        { label: 'Email Address', name: 'email', type: 'email' },
      ],
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Control how you receive updates',
      items: [
        { label: 'Job Alerts', name: 'jobAlerts', type: 'checkbox' },
        { label: 'Application Updates', name: 'applicationUpdates', type: 'checkbox' },
        { label: 'Weekly Reports', name: 'weeklyReports', type: 'checkbox' },
      ],
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Protect your account',
      items: [
        { label: 'Two-Factor Authentication', name: 'twoFactorAuth', type: 'checkbox' },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-xl text-gray-300">
              Customize your JobBot experience
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {settingsCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-xl border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/30"
                >
                  {/* Base background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 opacity-50"></div>
                  
                  {/* Animated gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 p-8">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 neon-glow">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors duration-300">{category.title}</h2>
                      <p className="text-gray-300 text-sm group-hover:text-gray-100 transition-colors duration-300">{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="group/item">
                        <label className="flex items-center gap-4 cursor-pointer transition-all duration-300">
                          {item.type === 'checkbox' ? (
                            <>
                              <div className="flex-1">
                                <p className="text-white font-medium group-hover/item:text-cyan-200 transition-colors duration-300">{item.label}</p>
                              </div>
                              <input
                                type="checkbox"
                                name={item.name}
                                checked={formData[item.name as keyof typeof formData] as boolean}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded cursor-pointer accent-blue-500 hover:accent-cyan-400 transition-all"
                              />
                            </>
                          ) : (
                            <>
                              <div className="flex-1">
                                <p className="text-white font-medium mb-2 group-hover/item:text-cyan-200 transition-colors duration-300">{item.label}</p>
                                <input
                                  type={item.type}
                                  name={item.name}
                                  value={formData[item.name as keyof typeof formData] as string}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2 rounded-lg bg-input border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all duration-300"
                                />
                              </div>
                            </>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Danger Zone */}
          <div className="group relative rounded-xl border border-red-500/20 backdrop-blur-xl mt-8 overflow-hidden transition-all duration-500 hover:border-red-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 bg-red-500/5">
              <h2 className="text-2xl font-bold text-red-400 mb-4 group-hover:text-red-300 transition-colors duration-300">Danger Zone</h2>
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                These actions cannot be undone. Please be careful.
              </p>
              <button className="px-6 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/80 transition-all duration-300 font-medium group/btn">
                Reset All Data
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-12 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group gradient-button px-8 py-3 text-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            >
              <Save className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
