'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Upload, CheckCircle2, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function Setup() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', logo: '💼', color: 'from-blue-600 to-blue-700' },
    { id: 'indeed', name: 'Indeed', logo: '🔍', color: 'from-blue-500 to-purple-600' },
    { id: 'glassdoor', name: 'Glassdoor', logo: '💬', color: 'from-purple-500 to-pink-600' },
    { id: 'ziprecruiter', name: 'ZipRecruiter', logo: '📝', color: 'from-orange-500 to-red-600' },
    { id: 'monster', name: 'Monster', logo: '👾', color: 'from-purple-600 to-blue-700' },
    { id: 'dice', name: 'Dice', logo: '🎯', color: 'from-red-500 to-orange-600' },
  ];

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/msword') {
        setResumeFile(file);
        toast.success(`Resume uploaded: ${file.name}`);
      } else {
        toast.error('Please upload a PDF or DOC file');
      }
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleAutoApply = async () => {
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setIsApplying(true);
    toast.loading('Starting auto-apply process...');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(`Successfully applied to ${Math.floor(Math.random() * 20) + 5} jobs!`);
    setIsApplying(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              <span className="gradient-text">Setup Your Profile</span>
            </h1>
            <p className="text-xl text-gray-300">
              Let&apos;s configure your job preferences and start automating applications
            </p>
          </div>

          {/* Setup Form */}
          <div className="glassmorphism p-8 md:p-12 rounded-2xl border border-white/10">
            <div className="space-y-8">
              {/* Resume Upload */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Upload Your Resume
                </label>
                <div
                  className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center hover:border-purple-500/80 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('resume-input')?.click()}
                >
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  {resumeFile ? (
                    <div>
                      <p className="text-white font-semibold">{resumeFile.name}</p>
                      <p className="text-sm text-gray-400 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white font-semibold">Drop your resume here</p>
                      <p className="text-sm text-gray-400">or click to browse (PDF, DOC)</p>
                    </div>
                  )}
                </div>
                <input
                  id="resume-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer, Product Manager"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-lg font-semibold text-white mb-6">
                  Select Job Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} ${selectedPlatforms.includes(platform.id) ? 'opacity-20' : 'opacity-0'} group-hover:opacity-15 transition-opacity`}></div>
                      <div className={`absolute inset-0 border rounded-xl transition-colors ${selectedPlatforms.includes(platform.id) ? 'border-white/40' : 'border-white/10 group-hover:border-white/20'}`}></div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="text-5xl transform group-hover:scale-110 transition-transform">{platform.logo}</div>
                        <p className="font-bold text-white text-sm group-hover:text-white transition-colors">{platform.name}</p>
                        {selectedPlatforms.includes(platform.id) && (
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleAutoApply}
                disabled={isApplying}
                className="w-full gradient-button px-8 py-4 text-lg inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                {isApplying ? 'Applying to Jobs...' : 'Start Auto Apply'}
              </button>

              {/* Info Box */}
              <div className="relative overflow-hidden rounded-xl p-6 border border-cyan-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
                <div className="relative z-10 flex items-start gap-4">
                  <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-200 text-sm">
                    <strong className="text-cyan-300">Auto Apply Magic:</strong> AutoApply analyzes your resume and applies to matching opportunities across all selected platforms. Track your progress and get notified for interviews in the Analytics dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
