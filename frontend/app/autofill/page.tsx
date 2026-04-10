'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, AlertCircle, FileUp } from 'lucide-react';

interface AutofillData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  targetRole: string;
  platforms: {
    linkedin: boolean;
    internshala: boolean;
    wellfound: boolean;
    indeed: boolean;
  };
  resumeName?: string;
}

const DEFAULT_DATA: AutofillData = {
  name: '',
  email: '',
  phone: '',
  skills: '',
  targetRole: '',
  platforms: {
    linkedin: false,
    internshala: false,
    wellfound: false,
    indeed: false,
  },
};

export default function AutofillPage() {
  const { toast } = useToast();
  const [data, setData] = useState<AutofillData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [extensionConnected, setExtensionConnected] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('autofillData');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved data:', e);
        }
      }

      // Check if extension is installed
      checkExtensionConnection();
    }
  }, []);

  const checkExtensionConnection = () => {
    // Check if extension can communicate
    window.addEventListener('message', (e) => {
      if (e.data.type === 'EXTENSION_READY') {
        setExtensionConnected(true);
      }
    });

    // Send test message
    setTimeout(() => {
      window.postMessage({ type: 'TEST_EXTENSION' }, '*');
    }, 500);
  };

  const handleInputChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlatformChange = (platform: keyof typeof data.platforms) => {
    setData((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform],
      },
    }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just store the filename
      // In production, you'd convert to base64 and store
      setData((prev) => ({
        ...prev,
        resumeName: file.name,
      }));
      toast({
        title: 'Resume Upload',
        description: `Uploaded: ${file.name}`,
      });
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.targetRole) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Check if at least one platform is selected
    const hasPlatform = Object.values(data.platforms).some((v) => v);
    if (!hasPlatform) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one platform',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save to localStorage
      localStorage.setItem('autofillData', JSON.stringify(data));

      // Send to extension via postMessage
      window.postMessage(
        {
          type: 'AUTOFILL_DATA_UPDATED',
          payload: data,
        },
        '*'
      );

      setIsSynced(true);

      toast({
        title: 'Success',
        description: 'Data saved and synced with extension',
      });

      // Reset synced state after 3 seconds
      setTimeout(() => setIsSynced(false), 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all autofill data?')) {
      localStorage.removeItem('autofillData');
      setData(DEFAULT_DATA);
      window.postMessage({ type: 'AUTOFILL_DATA_CLEARED' }, '*');
      toast({
        title: 'Cleared',
        description: 'All autofill data has been removed',
      });
    }
  };

  const selectedPlatformsCount = Object.values(data.platforms).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Autofill Setup</h1>
          <p className="text-lg text-slate-600">
            Configure your profile data for automatic job application filling
          </p>
        </div>

        {/* Extension Status */}
        <Card className={extensionConnected ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <CardContent className="pt-6 flex items-center gap-3">
            {extensionConnected ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Extension Connected</p>
                  <p className="text-sm text-green-700">Chrome Extension is ready to autofill</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">Extension Not Detected</p>
                  <p className="text-sm text-yellow-700">
                    Install the AutoApply extension to enable autofilling
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Required fields for autofill</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={data.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-10"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-10"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-semibold">
                Phone Number *
              </Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={data.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-10"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="font-semibold">
                Skills (Comma Separated)
              </Label>
              <Textarea
                id="skills"
                placeholder="Python, React, Node.js, MongoDB, Docker..."
                value={data.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="min-h-24 resize-none"
              />
              <p className="text-xs text-slate-500">
                These skills will help match job requirements
              </p>
            </div>

            {/* Target Role */}
            <div className="space-y-2">
              <Label htmlFor="targetRole" className="font-semibold">
                Target Role *
              </Label>
              <Input
                id="targetRole"
                placeholder="Backend Intern"
                value={data.targetRole}
                onChange={(e) => handleInputChange('targetRole', e.target.value)}
                className="h-10"
              />
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label htmlFor="resume" className="font-semibold">
                Upload Resume (Optional)
              </Label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="resume"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition"
                >
                  <FileUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Choose File</span>
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                {data.resumeName && (
                  <p className="text-sm text-slate-600">{data.resumeName}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platforms Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Target Platforms</CardTitle>
            <CardDescription>Select where you want to apply jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.platforms).map(([platform, enabled]) => (
                <div key={platform} className="flex items-center gap-3">
                  <Checkbox
                    id={platform}
                    checked={enabled}
                    onCheckedChange={() => handlePlatformChange(platform as keyof typeof data.platforms)}
                  />
                  <Label
                    htmlFor={platform}
                    className="capitalize font-medium cursor-pointer"
                  >
                    {platform === 'internshala' ? 'Internshala' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 pt-2">
              {selectedPlatformsCount} platform(s) selected
            </p>
          </CardContent>
        </Card>

        {/* Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>What will be saved to the extension</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm space-y-2 max-h-64 overflow-y-auto">
              <div>
                <span className="text-slate-600">Name:</span>{' '}
                <span className="text-slate-900 font-medium">{data.name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-600">Email:</span>{' '}
                <span className="text-slate-900 font-medium">{data.email || '—'}</span>
              </div>
              <div>
                <span className="text-slate-600">Phone:</span>{' '}
                <span className="text-slate-900 font-medium">{data.phone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-600">Target Role:</span>{' '}
                <span className="text-slate-900 font-medium">{data.targetRole || '—'}</span>
              </div>
              <div>
                <span className="text-slate-600">Platforms:</span>{' '}
                <span className="text-slate-900 font-medium">
                  {Object.entries(data.platforms)
                    .filter(([, v]) => v)
                    .map(([k]) => k)
                    .join(', ') || '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            size="lg"
            className="flex-1 h-11 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isSynced ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Synced with Extension
              </>
            ) : (
              'Save & Sync with Extension'
            )}
          </Button>

          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            className="h-11 text-base font-semibold"
          >
            Clear Data
          </Button>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Fill in your information and select target platforms</li>
              <li>Click "Save & Sync with Extension"</li>
              <li>Open a job listing on LinkedIn, Internshala, or Wellfound</li>
              <li>The extension will automatically detect the application form</li>
              <li>Your data will be filled in automatically</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
