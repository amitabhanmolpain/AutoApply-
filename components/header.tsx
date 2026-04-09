import { Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">JobBot</h1>
              <p className="text-sm text-muted-foreground">Automate your job applications</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-foreground">Smart Job Automation</p>
            <p className="text-muted-foreground">Apply to multiple jobs instantly</p>
          </div>
        </div>
      </div>
    </header>
  )
}
