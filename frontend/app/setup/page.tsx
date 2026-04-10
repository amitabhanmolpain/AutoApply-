'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Setup() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', logo: 'https://cdn-icons-png.flaticon.com/512/3536/3536505.png', color: 'from-blue-600 to-blue-700' },
    { id: 'intershala', name: 'Intershala', logo: 'https://cdn.aptoide.com/imgs/c/3/1/c31c5e531ad94d917080d17066c31470_icon.png', color: 'from-blue-500 to-cyan-600' },
    { id: 'wellfound', name: 'Wellfound', logo: 'https://logo.clearbit.com/wellfound.com', color: 'from-orange-500 to-red-600' },
    { id: 'indeed', name: 'Indeed', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThz8Qi-G6jIHt6TmCOguWjOKGYYQPB1afpSQ&s', color: 'from-blue-600 to-purple-700' },
    { id: 'naukri', name: 'Naukri.com', logo: 'https://static.naukimg.com/s/0/0/i/new-logos/naukri.png', color: 'from-blue-600 to-blue-700' },
  ];

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
      const lowerName = file.name.toLowerCase();
      const hasAllowedExtension = allowedExtensions.some((ext) => lowerName.endsWith(ext));
      const isAllowedType = allowedMimeTypes.includes(file.type) || hasAllowedExtension;

      if (isAllowedType) {
        setResumeFile(file);
        toast.success(`Resume selected: ${file.name}`);
        
        // Auto-save resume to database
        try {
          setIsSaving(true);
          const formData = new FormData();
          formData.append('resume', file);

          const response = await fetch('http://localhost:5000/api/profile/resume/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const uploadResult = await response.json();
            toast.success('Resume saved to profile');
            window.postMessage(
              {
                type: 'SYNC_PARSED_PROFILE',
                payload: {
                  parsed_profile: uploadResult.parsed_profile || null,
                  fileName: file.name,
                  timestamp: new Date().toISOString(),
                },
              },
              '*'
            );
            toast.success('Extracted fields synced to extension');
          } else {
            const errorData = await response.json().catch(() => ({}));
            toast.error(errorData.error || 'Failed to save resume');
          }
        } catch (error) {
          console.error('Error saving resume:', error);
          toast.error('Error saving resume');
        } finally {
          setIsSaving(false);
        }
      } else {
        toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      }
    }
  };

  const togglePlatform = async (platformId: string) => {
    const updated = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter((p) => p !== platformId)
      : [...selectedPlatforms, platformId];
    setSelectedPlatforms(updated);
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
              Upload your resume and configure your job search preferences. You can then apply to jobs from the Applications section.
            </p>
          </div>

          {/* Setup Form - Animated Background */}
          <div className="glass-card p-8 md:p-12 rounded-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-cyan-600/30 blur-2xl"></div>
            </div>
            <div className="space-y-8">
              {/* Resume Upload */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Upload Your Resume
                </label>
                <div
                  className="border-2 border-dashed border-blue-500/50 rounded-xl p-8 text-center hover:border-blue-500/80 transition-colors cursor-pointer bg-white/2"
                  onClick={() => document.getElementById('resume-input')?.click()}
                >
                  <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
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
                        <div className="w-16 h-16 group-hover:scale-125 transition-all duration-500 flex items-center justify-center">
                          <img 
                            src={platform.logo} 
                            alt={platform.name}
                            className="w-full h-full object-contain group-hover:drop-shadow-[0_0_16px_rgba(96,165,250,0.8)] transition-all duration-500"
                            loading="lazy"
                          />
                        </div>
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
                onClick={() => window.location.href = '/applications'}
                className="w-full gradient-button px-8 py-4 text-lg inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                Go to Applications
              </button>

              {/* Info Box */}
              <div className="relative overflow-hidden rounded-xl p-6 border border-cyan-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
                <div className="relative z-10 flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-200 text-sm">
                    <strong className="text-cyan-300">Next Step:</strong> Once your profile is set up, go to the Applications section to select job portals and start auto-applying to opportunities.
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
