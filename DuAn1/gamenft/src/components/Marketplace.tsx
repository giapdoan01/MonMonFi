"use client"

import { Glasses } from "lucide-react"
import Link from "next/link"
import "./Marketplace.css"



export default function Marketplace() {
  return (
    <div className="marketplace-card">
      <div className="marketplace-content">
        <div className="marketplace-info-area">
          <div className="marketplace-icon-container">
            <Glasses className="marketplace-icon" />
            
            <div className="marketplace-icon-glow"></div>
          </div>
        </div>
        
        
        <Link href="/VrView" className="fighting-button">
          <span>VrView</span>
        </Link>
      </div>
    </div>
  )
}