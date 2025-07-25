import React from "react";
import { useRouter } from "next/navigation";
import { levelConfigs } from "../game/levelConfigs";
import "./levelMenu.css";

export default function LevelMenu() {
  const router = useRouter();

  const handleSelect = (idx: number) => {
    // Chuyển sang trang GameScreen với query level
    router.push(`/Fight?level=${idx}`);
  };

  return (
    <div className="level-menu-container">
      <h2>Chọn Level</h2>
      <div className="level-list">
        {levelConfigs.map((level, idx) => (
          <button
            key={idx}
            className="level-btn"
            onClick={() => handleSelect(idx)}
          >
            Level {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
