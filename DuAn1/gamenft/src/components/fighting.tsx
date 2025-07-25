"use client"

import { Swords, ArrowRight } from "lucide-react"
import Link from "next/link"
import "./fighting.css"

interface FightingProps {
  fightingUrl?: string;
}

export default function Fighting({ fightingUrl = "/LevelMenu" }: FightingProps) {
  return (
    <div className="fighting-card">
      <div className="fighting-content">
        <div className="fighting-info-area">
          <span className="status-badge">LIVE</span>
          <div className="fighting-icon-container">
            <Swords className="fighting-icon" />
            <div className="fighting-icon-glow"></div>
          </div>
          <h3 className="fighting-title">FIGHTING</h3>
        </div>

        <Link href={fightingUrl} className="fighting-button">
          <Swords className="button-icon" />
          <span>Fight</span>
          <ArrowRight className="button-icon" />
        </Link>
      </div>
    </div>
  )
}
