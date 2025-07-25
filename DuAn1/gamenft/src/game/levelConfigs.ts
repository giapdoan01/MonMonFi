export interface LevelConfig {
  gridSize: number;
  tileSize: number;
  startX: number;
  startY: number;
  gemTypes: number;
  assetKey: string;
  assetPath: string;
  gridMap?: number[][];
}

export const levelConfigs: LevelConfig[] = [
  {
    gridSize: 7,
    tileSize: 56,
    startX: 40,
    startY: 40,
    gemTypes: 4,
    assetKey: "gems",
    assetPath: "/assets/gems_preview.png",
    gridMap: [
      [0,0,0,1,0,0,0],
      [0,0,1,1,1,0,0],
      [0,1,1,1,1,1,0],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
      [0,0,0,1,0,0,0],
    ]
  },
  // Thêm các level khác ở đây nếu muốn
];
