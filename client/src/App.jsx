import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import KnowledgeBaseSection from './components/KnowledgeBaseSection'
import ChannelsSection from './components/ChannelsSection'
import HowItWorks from './components/HowItWorks'
import Industries from './components/Industries'
import MultilingualSection from './components/MultilingualSection'
import AvailabilitySection from './components/AvailabilitySection'
import ProductPreview from './components/ProductPreview'
import SecuritySection from './components/SecuritySection'
import Pricing from './components/Pricing'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

export default function App() {
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
