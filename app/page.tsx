'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { SetupSection } from '@/components/setup-section'
import { DashboardSection } from '@/components/dashboard-section'

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false)
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedJobs: 0,
    rejectedJobs: 0,
    pendingJobs: 0,
  })

  const handleAutoApply = () => {
    setHasStarted(true)
    // Simulate applications coming in
    setTimeout(() => {
      setStats({
        totalApplications: 24,
        acceptedJobs: 8,
        rejectedJobs: 5,
        pendingJobs: 11,
      })
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {!hasStarted ? (
        <SetupSection onAutoApply={handleAutoApply} />
      ) : (
        <DashboardSection stats={stats} onReset={() => setHasStarted(false)} />
      )}
    </div>
  )
}
