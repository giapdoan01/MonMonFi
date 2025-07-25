"use client";

import { useEffect, useRef } from "react";
import "./GameScreen.css";
import { createDiamondScene} from "../game/DiamondScene";
import { levelConfigs } from "../game/levelConfigs";

interface GameScreenProps {
  levelIndex?: number;
}

export default function GameScreen({ levelIndex = 0 }: GameScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const config = levelConfigs[levelIndex] || levelConfigs[0];

  useEffect(() => {
    let destroyed = false;
    import("phaser").then((Phaser) => {
      if (!containerRef.current || gameRef.current || destroyed) return;
      const DiamondScene = createDiamondScene();
      const scene = new DiamondScene(config);
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: config.gridSize * config.tileSize + config.startX * 2,
        height: config.gridSize * config.tileSize + config.startY * 2,
        pixelArt: true,
        backgroundColor: "#77BEF0",
        parent: containerRef.current,
        scene: scene,
      });
    });
    return () => {
      destroyed = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [config]);
  return <div ref={containerRef} className="game-container" />;
}