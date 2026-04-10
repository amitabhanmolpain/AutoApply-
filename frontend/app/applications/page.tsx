'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

// Real job portal logos with URLs
const jobPortals = [
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    logo: '💼',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3536/3536505.png',
    color: 'from-blue-600 to-blue-700' 
  },
  { 
    id: 'intershala', 
    name: 'Intershala', 
    logo: '📱',
    logoUrl: 'https://cdn.aptoide.com/imgs/c/3/1/c31c5e531ad94d917080d17066c31470_icon.png',
    color: 'from-blue-500 to-cyan-600' 
  },
  { 
    id: 'wellfound', 
    name: 'Wellfound', 
    logo: '🚀',
    logoUrl: 'https://logo.clearbit.com/wellfound.com',
    color: 'from-orange-500 to-red-600' 
  },
  { 
    id: 'indeed', 
    name: 'Indeed', 
    logo: '🔍',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThz8Qi-G6jIHt6TmCOguWjOKGYYQPB1afpSQ&s',
    color: 'from-blue-600 to-purple-700' 
  },
  { 
    id: 'naukri', 
    name: 'Naukri.com', 
    logo: '💼',
    logoUrl: 'https://static.naukimg.com/s/0/0/i/new-logos/naukri.png',
    color: 'from-blue-600 to-blue-700'  
  },
];

export default function Applications() {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [parsedProfile, setParsedProfile] = useState<Record<string, unknown> | null>(null);
  const [selectedPortals, setSelectedPortals] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePortalToggle = (portalId: string) => {
    setSelectedPortals((prev) =>
      prev.includes(portalId) ? prev.filter((id) => id !== portalId) : [...prev, portalId]
    );
  };

  // Load profile data on mount and check for extension
  useEffect(() => {
    // Check if extension is installed
    let extensionReady = false;
    const extensionCheckTimer = setTimeout(() => {
      if (!extensionReady) {
        console.warn('[Applications] Extension not detected - web-bridge.js may not be injected');
      }
    }, 2000);

    const extensionListener = (event: MessageEvent) => {
      if (event.data.type === 'EXTENSION_READY') {
        extensionReady = true;
        console.log('[Applications] Extension is ready');
        clearTimeout(extensionCheckTimer);
      }
    };

    window.addEventListener('message', extensionListener);

    const loadProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile');
        if (response.ok) {
          const profile = await response.json();
          if (profile.position) {
            setSelectedPosition(profile.position);
          }
          if (profile.resume_text) {
            setResumeText(profile.resume_text);
            setResumeFileName(profile.resume_filename || 'Resume uploaded');

            try {
              const parsedResponse = await fetch('http://localhost:5000/api/profile/parsed');
              if (parsedResponse.ok) {
                const parsedData = await parsedResponse.json();
                setParsedProfile(parsedData.parsed_profile || null);
              }
            } catch (parseError) {
              console.warn('[Applications] Could not load parsed profile:', parseError);
            }
          }
          console.log('[Applications] Loaded profile:', profile);
        }
      } catch (error) {
        console.warn('[Applications] Could not load profile:', error);
      }
    };

    loadProfile();

    return () => {
      window.removeEventListener('message', extensionListener);
      clearTimeout(extensionCheckTimer);
    };
  }, []);

  const handleApply = async () => {
    if (!selectedPosition || !resumeText || selectedPortals.length === 0) {
      toast.error('Before applying, add a role, upload a resume, and select at least one portal.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save position to database
      try {
        await fetch('http://localhost:5000/api/profile/position', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: selectedPosition }),
        });
        console.log('[Applications] Position saved to database');
      } catch (error) {
        console.warn('[Applications] Could not save position:', error);
      }

      // Prepare data to send to extension
      let latestParsedProfile = parsedProfile;
      if (!latestParsedProfile) {
        try {
          const parsedResponse = await fetch('http://localhost:5000/api/profile/parsed');
          if (parsedResponse.ok) {
            const parsedData = await parsedResponse.json();
            latestParsedProfile = parsedData.parsed_profile || null;
            setParsedProfile(latestParsedProfile);
          }
        } catch (parseError) {
          console.warn('[Applications] Could not parse resume before apply:', parseError);
        }
      }

      const applicationData = {
        position: selectedPosition,
        resume: resumeText,
        fileName: resumeFileName,
        parsed_profile: latestParsedProfile,
        websites: selectedPortals,
        timestamp: new Date().toISOString(),
      };

      // Send to extension via postMessage
      window.postMessage(
        {
          type: 'APPLY_POSITION',
          payload: applicationData,
        },
        '*'
      );

      console.log('[Applications] Sent to extension:', applicationData);

      // Also send to backend to track batch application
      try {
        const backendResponse = await fetch('http://localhost:5000/api/applications/batch/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            position: selectedPosition,
            fileName: resumeFileName,
            websites: selectedPortals,
          }),
        });

        if (backendResponse.ok) {
          const batch = await backendResponse.json();
          console.log('[Applications] Backend batch created:', batch);
        } else {
          console.warn('[Applications] Backend batch creation failed:', backendResponse.statusText);
          toast.warning('Auto-apply started, but batch tracking could not be saved.');
        }
      } catch (backendError) {
        console.warn('[Applications] Could not reach backend:', backendError);
        toast.warning('Auto-apply started. Backend tracking is temporarily unavailable.');
        // Continue anyway, extension still works
      }

      toast.success(`Auto-apply started for ${selectedPosition} on ${selectedPortals.length} portal${selectedPortals.length > 1 ? 's' : ''}.`);

      // Reset form (keep resume as it's stored in DB)
      setSelectedPosition('');
      setSelectedPortals([]);
    } catch (error) {
      console.error('[Applications] Error:', error);
      toast.error('Unable to start auto-apply right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              <span className="gradient-text">Quick Apply</span>
            </h1>
            <p className="text-xl text-gray-300">
              Select your position, upload resume, and auto-apply to multiple job portals
            </p>
          </div>

          {/* Application Form Card */}
          <div className="glassmorphism rounded-2xl border border-white/10 p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form Inputs */}
              <div className="space-y-6">
                {/* Position Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Position Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Software Engineer, Product Manager"
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                {/* Resume Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Resume
                  </label>
                  <div className="px-4 py-4 rounded-lg bg-white/5 border border-white/10">
                    {resumeText ? (
                      <p className="text-sm text-green-400">✓ Resume loaded: {resumeFileName || 'Resume'}</p>
                    ) : (
                      <p className="text-sm text-yellow-400">No resume uploaded. Please go to <a href="/setup" className="underline hover:text-yellow-300">Setup</a> to upload your resume.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Portal Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4">
                  Select Job Portals ({selectedPortals.length}/{jobPortals.length})
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  {jobPortals.map((portal) => (
                    <button
                      key={portal.id}
                      onClick={() => handlePortalToggle(portal.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedPortals.includes(portal.id)
                          ? `border-blue-500 bg-blue-500/20 text-white`
                          : `border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10`
                      }`}
                    >
                      <img
                        src={portal.logoUrl}
                        alt={portal.name}
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3C/svg%3E';
                        }}
                      />
                      <span className="text-sm font-medium">{portal.name}</span>
                      {selectedPortals.includes(portal.id) && (
                        <span className="ml-auto text-blue-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={isSubmitting}
              className="w-full mt-8 gradient-button px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Applying...' : 'Start Applying'}
            </button>
          </div>

          <div className="glassmorphism rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-3">How This Works</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              After you click Start Applying, AutoApply sends your selected role, resume, and portal choices to the browser extension.
              Keep job tabs open for the selected portals so autofill can start immediately.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
