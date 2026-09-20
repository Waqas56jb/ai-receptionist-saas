import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
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
import FAQ from '../components/landing/FAQ'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'
import { SiteThemeProvider } from '../context/SiteThemeContext'

export default function Landing() {
  return (
    <SiteThemeProvider>
      <div id="top" className="site">
        <Navbar />

        <main id="main">
          <Hero />
          <SolutionSection />
          <HowItWorks />
          <Industries />
          <ChannelsSection />
          <KnowledgeBaseSection />
          <MultilingualSection />
          <AvailabilitySection />
          <ProductPreview />
          <SecuritySection />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>

        <Footer />
      </div>
    </SiteThemeProvider>
  )
}
