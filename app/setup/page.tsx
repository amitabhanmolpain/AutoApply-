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
    { id: 'linkedin', name: 'LinkedIn', logo: '💼' },
    { id: 'indeed', name: 'Indeed', logo: '🔍' },
    { id: 'glassdoor', name: 'Glassdoor', logo: '💬' },
    { id: 'ziprecruiter', name: 'ZipRecruiter', logo: '📝' },
    { id: 'monster', name: 'Monster', logo: '👹' },
    { id: 'dice', name: 'Dice', logo: '🎲' },
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
                <label className="block text-lg font-semibold text-white mb-4">
                  Select Job Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 rounded-lg border transition-all duration-300 flex items-center gap-3 font-medium ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">{platform.logo}</span>
                      <div className="text-left">
                        <p>{platform.name}</p>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <CheckCircle2 className="w-5 h-5 ml-auto text-purple-400" />
                      )}
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
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-cyan-300 text-sm">
                  <strong>Pro Tip:</strong> JobBot will analyze your resume and apply to matching job postings across all selected platforms. You can track all applications in the Analytics section.
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
