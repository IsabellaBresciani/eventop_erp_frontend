import { useState } from 'react'
import { Navbar } from '../components/landing/Navbar'
import { HeroSection } from '../components/landing/HeroSection'
import { ProblemSolutionSection } from '../components/landing/ProblemSolutionSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { CtaSection, Footer } from '../components/landing/Footer'
import { AuthModal } from '../components/ui/AuthModal'

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div className="min-h-screen">
      <Navbar onOpenAuth={openAuth} />
      <main>
        <HeroSection
          onOpenRegister={() => openAuth('register')}
          onOpenLogin={() => openAuth('login')}
        />
        <ProblemSolutionSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection onOpenRegister={() => openAuth('register')} />
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </div>
  )
}
