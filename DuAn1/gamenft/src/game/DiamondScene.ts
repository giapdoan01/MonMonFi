

export interface DiamondSceneConfig {
  gridSize: number;
  tileSize: number;
  startX: number;
  startY: number;
  gemTypes: number;
  assetKey: string;
  assetPath: string;
  gridMap?: number[][]; // 1: có gem, 0: không có gem
}

// Factory function: truyền Phaser vào, trả về class DiamondScene
export function createDiamondScene(Phaser: any) {
  return class DiamondScene extends Phaser.Scene {
    private config: DiamondSceneConfig;
    private board: (any | null)[][] = [];
    private selectedGem: any | null = null;

    constructor(config: DiamondSceneConfig) {
      super({ key: "DiamondScene" });
      this.config = config;
    }

    preload() {
      this.load.spritesheet(
        this.config.assetKey,
        this.config.assetPath,
        {
          frameWidth: 125,
          frameHeight: 125,
        }
      );
    }

    create() {
      const { gridSize, tileSize, startX, startY, gemTypes, assetKey } = this.config;
      const center = Math.floor(gridSize / 2);
      this.board = [];
      this.selectedGem = null;

      const getGemAt = (row: number, col: number) => {
        return this.board[row]?.[col] || null;
      };

      const swapGems = (
        gem1: any,
        gem2: any,
        checkAfterSwap = true
      ) => {
        const row1 = gem1.getData("row");
        const col1 = gem1.getData("col");
        const row2 = gem2.getData("row");
        const col2 = gem2.getData("col");

        this.board[row1][col1] = gem2;
        this.board[row2][col2] = gem1;

        gem1.setData("row", row2);
        gem1.setData("col", col2);
        gem2.setData("row", row1);
        gem2.setData("col", col1);

        this.tweens.add({
          targets: gem1,
          x: startX + col2 * tileSize,
          y: startY + row2 * tileSize,
          duration: 200,
        });
        this.tweens.add({
          targets: gem2,
          x: startX + col1 * tileSize,
          y: startY + row1 * tileSize,
          duration: 200,
        });

        if (checkAfterSwap) {
          this.time.delayedCall(250, () => {
            const matches = findMatches();
            if (matches.length === 0) {
              swapGems(gem1, gem2, false);
            } else {
              removeMatches(matches);
            }
          });
        }
      };

      const findMatches = (): any[] => {
        const matches: any[] = [];
        // Horizontal
        for (let row = 0; row < gridSize; row++) {
          let match: any[] = [];
          let lastType = -1;
          for (let col = 0; col < gridSize; col++) {
            if (Math.abs(row - center) + Math.abs(col - center) > center) {
              if (match.length >= 3) matches.push(...match);
              match = [];
              lastType = -1;
              continue;
            }
            const gem = this.board[row][col];
            if (!gem) {
              match = [];
              lastType = -1;
              continue;
            }
            const type = gem.getData("type");
            if (type === lastType) {
              match.push(gem);
            } else {
              if (match.length >= 3) matches.push(...match);
              match = [gem];
              lastType = type;
            }
          }
          if (match.length >= 3) matches.push(...match);
        }
        // Vertical
        for (let col = 0; col < gridSize; col++) {
          let match: any[] = [];
          let lastType = -1;
          for (let row = 0; row < gridSize; row++) {
            if (Math.abs(row - center) + Math.abs(col - center) > center) {
              if (match.length >= 3) matches.push(...match);
              match = [];
              lastType = -1;
              continue;
            }
            const gem = this.board[row][col];
            if (!gem) {
              match = [];
              lastType = -1;
              continue;
            }
            const type = gem.getData("type");
            if (type === lastType) {
              match.push(gem);
            } else {
              if (match.length >= 3) matches.push(...match);
              match = [gem];
              lastType = type;
            }
          }
          if (match.length >= 3) matches.push(...match);
        }
        return matches;
      };

      const removeMatches = (matches: any[]) => {
        matches.forEach((gem) => {
          if (!gem) return;
          const row = gem.getData("row");
          const col = gem.getData("col");
          if (this.board[row] && this.board[row][col] === gem) {
            this.board[row][col] = null;
            gem.destroy();
          }
        });
        this.time.delayedCall(250, () => dropGems());
      };

      const dropGems = () => {
        for (let col = 0; col < gridSize; col++) {
          let firstRow = 0;
          while (
            firstRow < gridSize &&
            Math.abs(firstRow - center) + Math.abs(col - center) > center
          ) {
            firstRow++;
          }
          let emptyCount = 0;
          for (let row = gridSize - 1; row >= firstRow; row--) {
            if (Math.abs(row - center) + Math.abs(col - center) > center) continue;
            const gem = this.board[row][col];
            if (!gem) {
              emptyCount++;
            } else if (emptyCount > 0) {
              this.board[row + emptyCount][col] = gem;
              gem.setData("row", row + emptyCount);
              this.board[row][col] = null;
              this.tweens.add({
                targets: gem,
                y: startY + (row + emptyCount) * tileSize,
                duration: 200,
              });
            }
          }
          for (let i = 0; i < emptyCount; i++) {
            const row = firstRow + i;
            if (Math.abs(row - center) + Math.abs(col - center) > center) continue;
            const type = Phaser.Math.Between(0, gemTypes - 1);
            const gem = this.add
              .sprite(
                startX + col * tileSize,
                startY - tileSize * (emptyCount - i),
                assetKey,
                type
              )
              .setDisplaySize(tileSize, tileSize)
              .setOrigin(0)
              .setInteractive();
            gem.setData("type", type);
            gem.setData("row", row);
            gem.setData("col", col);
            gem.on("pointerdown", onGemClick);
            this.board[row][col] = gem;
            this.tweens.add({
              targets: gem,
              y: startY + row * tileSize,
              duration: 300,
            });
          }
        }
        this.time.delayedCall(350, () => {
          const matches = findMatches();
          if (matches.length > 0) removeMatches(matches);
        });
      };

      const onGemClick = function (this: any) {
        const gem = this;
        const scene = gem.scene as any;
        if (!scene.selectedGem) {
          scene.selectedGem = gem;
          gem.setAlpha(0.5);
        } else if (scene.selectedGem === gem) {
          gem.setAlpha(1);
          scene.selectedGem = null;
        } else {
          const row1 = scene.selectedGem.getData("row");
          const col1 = scene.selectedGem.getData("col");
          const row2 = gem.getData("row");
          const col2 = gem.getData("col");
          const isAdjacent =
            (Math.abs(row1 - row2) === 1 && col1 === col2) ||
            (Math.abs(col1 - col2) === 1 && row1 === row2);
          if (isAdjacent) {
            swapGems(scene.selectedGem, gem);
          }
          scene.selectedGem.setAlpha(1);
          scene.selectedGem = null;
        }
      };

      // Init board hỗ trợ gridMap tùy biến cho từng level
      for (let row = 0; row < gridSize; row++) {
        this.board[row] = [];
        for (let col = 0; col < gridSize; col++) {
          let isGemCell = false;
          if (this.config.gridMap) {
            isGemCell = !!this.config.gridMap[row]?.[col];
          } else {
            isGemCell = Math.abs(row - center) + Math.abs(col - center) <= center;
          }
          if (isGemCell) {
            const x = startX + col * tileSize;
            const y = startY + row * tileSize;
            const type = Phaser.Math.Between(0, gemTypes - 1);
            const gem = this.add
              .sprite(x, y, assetKey, type)
              .setDisplaySize(tileSize, tileSize)
              .setOrigin(0)
              .setInteractive();
            gem.setData("row", row);
            gem.setData("col", col);
            gem.setData("type", type);
            gem.on("pointerdown", onGemClick);
            this.board[row][col] = gem;
          } else {
            this.board[row][col] = null;
          }
        }
      }
      // Initial match
      const initialMatches = findMatches();
      if (initialMatches.length > 0) {
        removeMatches(initialMatches);
      }
    }
  };
}
