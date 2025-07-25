export interface LevelConfig {
  gridSize: number;
  tileSize: number;
  startX: number;
  startY: number;
  gemTypes: number;
  assetKey: string;
  assetPath: string;
  gridMap?: number[][];
  gemLayout?: number[][]; // Thêm thuộc tính gemLayout để cố định vị trí và loại gem
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
    ],
    gemLayout: [
      [0,0,0,2,0,0,0],
      [0,0,1,3,1,0,0],
      [0,2,1,0,1,3,0],
      [1,1,2,3,2,1,1],
      [0,3,1,2,1,2,0],
      [0,0,2,1,3,0,0],
      [0,0,0,1,0,0,0],
    ]
  },
  {
    gridSize: 5,
    tileSize: 56,
    startX: 40,
    startY: 40,
    gemTypes: 4,
    assetKey: "gems",
    assetPath: "/assets/gems_preview.png",
    gridMap: [
      [0,1,0,0,0],
      [1,1,1,0,0],
      [1,1,1,1,0],
      [1,1,1,1,1],
      [1,1,1,1,0],
    ],
    gemLayout: [
      [0,2,0,0,0],
      [1,3,1,0,0],
      [1,0,1,3,0],
      [2,3,2,1,1],
      [1,2,1,2,0]
    ]
  },
  // Thêm các level khác ở đây nếu muốn
];
