"use client"

import { Store} from "lucide-react"
import "./Marketplace.css"


interface MarketplaceProps {
  marketplaceUrl?: string
}

export default function Marketplace({ marketplaceUrl = "https://opensea.io/" }: MarketplaceProps) {
  return (
    <div className="marketplace-card">
      <div className="marketplace-content">
        <div className="marketplace-info-area">
          <div className="marketplace-icon-container">
            <Store className="marketplace-icon" />
            <div className="marketplace-icon-glow"></div>
          </div>
        </div>

        <a href={marketplaceUrl} target="_blank" rel="noopener noreferrer" className="marketplace-button">
        
          <span>Marketplace</span>
        </a>
      </div>
    </div>
  )
}
