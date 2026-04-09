'use client'

import { useState } from 'react'
import { Upload, FileText, Target, Globe, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SetupSectionProps {
  onAutoApply: () => void
}

const WEBSITES = [
  { id: 'linkedin', name: 'LinkedIn', icon: 'https://cdn-icons-png.flaticon.com/512/3536/3536505.png' },
  { id: 'intershala', name: 'Intershala', icon: 'https://cdn.aptoide.com/imgs/c/3/1/c31c5e531ad94d917080d17066c31470_icon.png' },
  { id: 'wellfound', name: 'Wellfound', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_uvmLprvNSpkN84gOZSYVaGS6iyuiINTGdw&s' },
  { id: 'indeed', name: 'Indeed', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThz8Qi-G6jIHt6TmCOguWjOKGYYQPB1afpSQ&s' },
  { id: 'naukri', name: 'Naukri.com', icon: 'https://static.naukimg.com/s/0/0/i/new-logos/naukri.png' },
]

export function SetupSection({ onAutoApply }: SetupSectionProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobPosition, setJobPosition] = useState('')
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>(['linkedin', 'indeed'])
  const [isLoading, setIsLoading] = useState(false)

  const toggleWebsite = (id: string) => {
    setSelectedWebsites((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    )
  }

  const handleAutoApply = async () => {
    if (!resumeFile || !jobPosition) {
      alert('Please upload a resume and enter a job position')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      onAutoApply()
      setIsLoading(false)
    }, 1500)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="space-y-8">
          {/* Resume Upload */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Your Resume</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Upload your resume to apply across platforms
            </p>

            <label className="flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary hover:bg-primary/5">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground">
                  {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                </p>
                {!resumeFile && (
                  <p className="text-sm text-muted-foreground">PDF or DOCX up to 10MB</p>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Job Position */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Target Position</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Enter the job position you&apos;re applying for
            </p>

            <input
              type="text"
              placeholder="e.g., Senior Frontend Engineer, Product Manager"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Column - Websites */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Globe className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Apply To</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            Select which platforms to submit your applications
          </p>

          <div className="space-y-3">
            {WEBSITES.map((website) => (
              <button
                key={website.id}
                onClick={() => toggleWebsite(website.id)}
                className={`flex w-full items-center gap-4 rounded-lg border-2 px-4 py-4 transition-all ${
                  selectedWebsites.includes(website.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border/80 bg-background/50'
                }`}
              >
                <img src={website.icon} alt={website.name} className="h-8 w-8 object-contain" />
                <span className="flex-1 text-left font-medium text-foreground">
                  {website.name}
                </span>
                {selectedWebsites.includes(website.id) && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Stats Preview */}
          <div className="mt-8 space-y-2 rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground">
              Ready to apply to {selectedWebsites.length} platform{selectedWebsites.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-muted-foreground">
              Position: <span className="font-semibold text-foreground">{jobPosition || 'Not set'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Auto Apply Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleAutoApply}
          disabled={isLoading || !resumeFile || !jobPosition}
          size="lg"
          className="min-w-xs px-8 py-6 text-lg font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
              Applying...
            </span>
          ) : (
            'Start Auto Apply'
          )}
        </Button>
      </div>
    </main>
  )
}
