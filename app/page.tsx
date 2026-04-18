import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CredibilityStrip from '@/components/CredibilityStrip'
import ProblemSection from '@/components/ProblemSection'
import SignalsPreview from '@/components/SignalsPreview'
import MoatsSection from '@/components/MoatsSection'
import FounderSection from '@/components/FounderSection'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CredibilityStrip />
        <ProblemSection />
        <SignalsPreview />
        <MoatsSection />
        <FounderSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
