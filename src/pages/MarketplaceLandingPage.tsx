import { MarketplaceLayout } from '../components/marketplace/layout/MarketplaceLayout'
import { CategoryCards } from '../components/marketplace/landing/CategoryCards'
import { FeaturedVenues } from '../components/marketplace/landing/FeaturedVenues'
import {
  AboutPurposeSection,
  HeroSearch,
  HeroStatsStrip,
  PromoControlSection,
} from '../components/marketplace/landing/LandingSections'

export default function MarketplaceLandingPage() {
  return (
    <MarketplaceLayout showSubnav={false} transparentNav>
      <HeroSearch />
      <HeroStatsStrip />
      <CategoryCards />
      <FeaturedVenues />
      <PromoControlSection />
      <AboutPurposeSection />
    </MarketplaceLayout>
  )
}
