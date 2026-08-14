import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import TrustBar from '../components/landing/TrustBar'
import ProblemSection from '../components/landing/ProblemSection'
import SolutionSection from '../components/landing/SolutionSection'
import KnowledgeBaseSection from '../components/landing/KnowledgeBaseSection'
import ChannelsSection from '../components/landing/ChannelsSection'
import HowItWorks from '../components/landing/HowItWorks'
import Industries from '../components/landing/Industries'
import MultilingualSection from '../components/landing/MultilingualSection'
import AvailabilitySection from '../components/landing/AvailabilitySection'
import ProductPreview from '../components/landing/ProductPreview'
import SecuritySection from '../components/landing/SecuritySection'
import Pricing from '../components/landing/Pricing'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div id="top" className="min-h-screen bg-white">
      <Navbar />

      <main id="main">
        <Hero />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <KnowledgeBaseSection />
        <ChannelsSection />
        <HowItWorks />
        <Industries />
        <MultilingualSection />
        <AvailabilitySection />
        <ProductPreview />
        <SecuritySection />
        <Pricing />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
