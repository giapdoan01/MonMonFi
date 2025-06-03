"use client"

import { Droplets, ExternalLink } from "lucide-react"
import "./faucet.css"

interface FaucetProps {
  faucetUrl?: string
}

export default function Faucet({ faucetUrl = "https://cloud.google.com/application/web3/faucet/ethereum/sepolia" }: FaucetProps) {
  return (
    <div className="faucet-card">
      <div className="faucet-content">
        <div className="faucet-info-area">
          <span className="network-badge">Sepolia</span>
          <div className="faucet-icon-container">
            <Droplets className="faucet-icon" />
            <div className="faucet-icon-glow"></div>
          </div>
        </div>

        <a href={faucetUrl} target="_blank" rel="noopener noreferrer" className="faucet-button">
          <ExternalLink className="button-icon" />
          <span>Nhận ETH Sepolia</span>
        </a>
      </div>
    </div>
  )
}
