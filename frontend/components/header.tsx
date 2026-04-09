import { Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="glass-card border-b sticky top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2 neon-glow-blue">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">JobBot</h1>
              <p className="text-xs text-gray-400">Automate your job applications</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-white">Smart Job Automation</p>
            <p className="text-gray-400">Apply to multiple jobs instantly</p>
          </div>
        </div>
      </div>
    </header>
  )
}
