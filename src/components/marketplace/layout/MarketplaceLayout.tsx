import type { ReactNode } from 'react'
import { MarketplaceFooter } from './MarketplaceFooter'
import { MarketplaceMobileNav, MarketplaceSubnav } from './MarketplaceSubnav'
import { MarketplaceNavbar } from './MarketplaceNavbar'

interface MarketplaceLayoutProps {
  children: ReactNode
  className?: string
  showSubnav?: boolean
  transparentNav?: boolean
}

export function MarketplaceLayout({
  children,
  className = '',
  showSubnav = true,
  transparentNav = false,
}: MarketplaceLayoutProps) {
  return (
    <div className={`marketplace-shell ${className}`}>
      <MarketplaceNavbar transparent={transparentNav} />
      {showSubnav && <MarketplaceSubnav />}
      <main className="pb-24 md:pb-0">{children}</main>
      <MarketplaceFooter />
      <MarketplaceMobileNav />
    </div>
  )
}
