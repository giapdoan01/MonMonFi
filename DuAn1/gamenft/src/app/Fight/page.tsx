"use client"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const GameScreen = dynamic(() => import("@/components/GameScreen"), { ssr: false })
const LevelMenu = dynamic(() => import("@/components/levelMenu"), { ssr: false })

function FightingContent() {
  const searchParams = useSearchParams()
  const level = searchParams.get("level")
  const levelIndex = level ? Number.parseInt(level, 10) : null

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      {levelIndex === null || isNaN(levelIndex) ? <LevelMenu /> : <GameScreen levelIndex={levelIndex} />}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải game...</p>
      </div>
    </div>
  )
}

export default function FightingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FightingContent />
    </Suspense>
  )
}
