"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const GameScreen = dynamic(() => import("@/components/GameScreen"), { ssr: false });
const LevelMenu = dynamic(() => import("@/components/levelMenu"), { ssr: false });

export default function FightingPage() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level");
  const levelIndex = level ? parseInt(level, 10) : null;

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      {levelIndex === null || isNaN(levelIndex) ? (
        <LevelMenu />
      ) : (
        <GameScreen levelIndex={levelIndex} />
      )}
    </div>
  );
}
