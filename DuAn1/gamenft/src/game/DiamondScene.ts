import Phaser from "phaser"

export interface DiamondSceneConfig {
  gridSize: number
  tileSize: number
  startX: number
  startY: number
  gemTypes: number
  assetKey: string
  assetPath: string
  gridMap?: number[][]
  gemLayout?: number[][]
}

interface GemSprite extends Phaser.GameObjects.Sprite {
  getData(key: string): number
  setData(key: string, value: number): this
}

// Xóa interface GemData không sử dụng

// Factory function: truyền Phaser vào, trả về class DiamondScene
export function createDiamondScene() {
  return class DiamondScene extends Phaser.Scene {
    private config: DiamondSceneConfig
    private board: (GemSprite | null)[][] = []
    private selectedGem: GemSprite | null = null

    constructor(config: DiamondSceneConfig) {
      super({ key: "DiamondScene" })
      this.config = config
    }

    preload(): void {
      this.load.spritesheet(this.config.assetKey, this.config.assetPath, {
        frameWidth: 125,
        frameHeight: 125,
      })
    }

    create(): void {
      const { gridSize, tileSize, startX, startY, gemTypes, assetKey } = this.config
      const center = Math.floor(gridSize / 2)
      this.board = []
      this.selectedGem = null

      // Helper function để kiểm tra cell có hợp lệ không
      const isValidCell = (row: number, col: number): boolean => {
        if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
          return false
        }

        if (this.config.gridMap) {
          return !!this.config.gridMap[row]?.[col]
        } else {
          return Math.abs(row - center) + Math.abs(col - center) <= center
        }
      }

      // Chuyển swapGems thành method của class để tránh lỗi unused
      const findMatches = (): GemSprite[] => {
        const matches: GemSprite[] = []

        // Horizontal matches
        for (let row = 0; row < gridSize; row++) {
          let match: GemSprite[] = []
          let lastType = -1

          for (let col = 0; col < gridSize; col++) {
            if (!isValidCell(row, col)) {
              if (match.length >= 3) {
                matches.push(...match)
              }
              match = []
              lastType = -1
              continue
            }

            const gem = this.board[row][col]
            if (!gem) {
              if (match.length >= 3) {
                matches.push(...match)
              }
              match = []
              lastType = -1
              continue
            }

            const type = gem.getData("type")
            if (type === lastType) {
              match.push(gem)
            } else {
              if (match.length >= 3) {
                matches.push(...match)
              }
              match = [gem]
              lastType = type
            }
          }

          if (match.length >= 3) {
            matches.push(...match)
          }
        }

        // Vertical matches
        for (let col = 0; col < gridSize; col++) {
          let match: GemSprite[] = []
          let lastType = -1

          for (let row = 0; row < gridSize; row++) {
            if (!isValidCell(row, col)) {
              if (match.length >= 3) {
                matches.push(...match)
              }
              match = []
              lastType = -1
              continue
            }

            const gem = this.board[row][col]
            if (!gem) {
              if (match.length >= 3) {
                matches.push(...match)
              }
              match = []
              lastType = -1
              continue
            }

            const type = gem.getData("type")
            if (type === lastType) {
              match.push(gem)
            } else {
              if (match.length >= 3) {
                matches.push(...match)
              }
              match = [gem]
              lastType = type
            }
          }

          if (match.length >= 3) {
            matches.push(...match)
          }
        }

        return matches
      }

      const removeMatches = (matches: GemSprite[]): void => {
        matches.forEach((gem) => {
          if (!gem) return
          const row = gem.getData("row")
          const col = gem.getData("col")
          if (this.board[row] && this.board[row][col] === gem) {
            this.board[row][col] = null
            gem.destroy()
          }
        })
        this.time.delayedCall(250, () => dropGems())
      }

      const dropGems = (): void => {
        for (let col = 0; col < gridSize; col++) {
          let firstValidRow = -1
          for (let row = 0; row < gridSize; row++) {
            if (isValidCell(row, col)) {
              firstValidRow = row
              break
            }
          }

          if (firstValidRow === -1) continue

          let emptyCount = 0

          for (let row = gridSize - 1; row >= firstValidRow; row--) {
            if (!isValidCell(row, col)) continue

            const gem = this.board[row][col]
            if (!gem) {
              emptyCount++
            } else if (emptyCount > 0) {
              let dropRow = row + emptyCount
              while (dropRow < gridSize && !isValidCell(dropRow, col)) {
                dropRow++
              }
              if (dropRow < gridSize && isValidCell(dropRow, col)) {
                this.board[dropRow][col] = gem
                gem.setData("row", dropRow)
                this.board[row][col] = null
                this.tweens.add({
                  targets: gem,
                  y: startY + dropRow * tileSize,
                  duration: 200,
                })
              }
            }
          }

          for (let i = 0; i < emptyCount; i++) {
            let targetRow = firstValidRow + i
            while (targetRow < gridSize && !isValidCell(targetRow, col)) {
              targetRow++
            }

            if (targetRow >= gridSize || !isValidCell(targetRow, col)) continue

            const type = Phaser.Math.Between(0, gemTypes - 1)
            const gem = this.add
              .sprite(startX + col * tileSize, startY - tileSize * (emptyCount - i), assetKey, type)
              .setDisplaySize(tileSize, tileSize)
              .setOrigin(0)
              .setInteractive() as GemSprite

            gem.setData("type", type)
            gem.setData("row", targetRow)
            gem.setData("col", col)

            // Fix this context issue
            const handleClick = (): void => {
              this.handleGemClick(gem)
            }
            gem.on("pointerdown", handleClick)

            this.board[targetRow][col] = gem
            this.tweens.add({
              targets: gem,
              y: startY + targetRow * tileSize,
              duration: 300,
            })
          }
        }

        this.time.delayedCall(350, () => {
          const matches = findMatches()
          if (matches.length > 0) removeMatches(matches)
        })
      }

      // Init board
      for (let row = 0; row < gridSize; row++) {
        this.board[row] = []
        for (let col = 0; col < gridSize; col++) {
          const isGemCell = isValidCell(row, col)

          if (isGemCell) {
            const x = startX + col * tileSize
            const y = startY + row * tileSize

            let type: number
            if (this.config.gemLayout && this.config.gemLayout[row]?.[col] !== undefined) {
              type = this.config.gemLayout[row][col]
            } else {
              type = Phaser.Math.Between(0, gemTypes - 1)
            }

            const gem = this.add
              .sprite(x, y, assetKey, type)
              .setDisplaySize(tileSize, tileSize)
              .setOrigin(0)
              .setInteractive() as GemSprite

            gem.setData("row", row)
            gem.setData("col", col)
            gem.setData("type", type)

            // Fix this context issue
            const handleClick = (): void => {
              this.handleGemClick(gem)
            }
            gem.on("pointerdown", handleClick)

            this.board[row][col] = gem
          } else {
            this.board[row][col] = null
          }
        }
      }

      // Initial match check
      const initialMatches = findMatches()
      if (initialMatches.length > 0) {
        removeMatches(initialMatches)
      }
    }

    private handleGemClick(gem: GemSprite): void {
      if (!this.selectedGem) {
        this.selectedGem = gem
        gem.setAlpha(0.5)
      } else if (this.selectedGem === gem) {
        gem.setAlpha(1)
        this.selectedGem = null
      } else {
        const row1 = this.selectedGem.getData("row")
        const col1 = this.selectedGem.getData("col")
        const row2 = gem.getData("row")
        const col2 = gem.getData("col")

        const isAdjacent =
          (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2)

        if (isAdjacent) {
          this.swapGemsMethod(this.selectedGem, gem)
        }

        this.selectedGem.setAlpha(1)
        this.selectedGem = null
      }
    }

    private swapGemsMethod(gem1: GemSprite, gem2: GemSprite, checkAfterSwap = true): void {
      const { tileSize, startX, startY } = this.config

      const row1 = gem1.getData("row")
      const col1 = gem1.getData("col")
      const row2 = gem2.getData("row")
      const col2 = gem2.getData("col")

      this.board[row1][col1] = gem2
      this.board[row2][col2] = gem1

      gem1.setData("row", row2)
      gem1.setData("col", col2)
      gem2.setData("row", row1)
      gem2.setData("col", col1)

      this.tweens.add({
        targets: gem1,
        x: startX + col2 * tileSize,
        y: startY + row2 * tileSize,
        duration: 200,
      })
      this.tweens.add({
        targets: gem2,
        x: startX + col1 * tileSize,
        y: startY + row1 * tileSize,
        duration: 200,
      })

      if (checkAfterSwap) {
        this.time.delayedCall(250, () => {
          const matches = this.findMatchesMethod()
          if (matches.length === 0) {
            this.swapGemsMethod(gem1, gem2, false)
          } else {
            this.removeMatchesMethod(matches)
          }
        })
      }
    }

    private findMatchesMethod(): GemSprite[] {
      const { gridSize } = this.config
      const center = Math.floor(gridSize / 2)
      const matches: GemSprite[] = []

      const isValidCell = (row: number, col: number): boolean => {
        if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
          return false
        }
        if (this.config.gridMap) {
          return !!this.config.gridMap[row]?.[col]
        } else {
          return Math.abs(row - center) + Math.abs(col - center) <= center
        }
      }

      // Horizontal matches
      for (let row = 0; row < gridSize; row++) {
        let match: GemSprite[] = []
        let lastType = -1

        for (let col = 0; col < gridSize; col++) {
          if (!isValidCell(row, col)) {
            if (match.length >= 3) {
              matches.push(...match)
            }
            match = []
            lastType = -1
            continue
          }

          const gem = this.board[row][col]
          if (!gem) {
            if (match.length >= 3) {
              matches.push(...match)
            }
            match = []
            lastType = -1
            continue
          }

          const type = gem.getData("type")
          if (type === lastType) {
            match.push(gem)
          } else {
            if (match.length >= 3) {
              matches.push(...match)
            }
            match = [gem]
            lastType = type
          }
        }

        if (match.length >= 3) {
          matches.push(...match)
        }
      }

      // Vertical matches
      for (let col = 0; col < gridSize; col++) {
        let match: GemSprite[] = []
        let lastType = -1

        for (let row = 0; row < gridSize; row++) {
          if (!isValidCell(row, col)) {
            if (match.length >= 3) {
              matches.push(...match)
            }
            match = []
            lastType = -1
            continue
          }

          const gem = this.board[row][col]
          if (!gem) {
            if (match.length >= 3) {
              matches.push(...match)
            }
            match = []
            lastType = -1
            continue
          }

          const type = gem.getData("type")
          if (type === lastType) {
            match.push(gem)
          } else {
            if (match.length >= 3) {
              matches.push(...match)
            }
            match = [gem]
            lastType = type
          }
        }

        if (match.length >= 3) {
          matches.push(...match)
        }
      }

      return matches
    }

    private removeMatchesMethod(matches: GemSprite[]): void {
      matches.forEach((gem) => {
        if (!gem) return
        const row = gem.getData("row")
        const col = gem.getData("col")
        if (this.board[row] && this.board[row][col] === gem) {
          this.board[row][col] = null
          gem.destroy()
        }
      })
      this.time.delayedCall(250, () => this.dropGemsMethod())
    }

    private dropGemsMethod(): void {
      const { gridSize, tileSize, startX, startY, gemTypes, assetKey } = this.config
      const center = Math.floor(gridSize / 2)

      const isValidCell = (row: number, col: number): boolean => {
        if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
          return false
        }
        if (this.config.gridMap) {
          return !!this.config.gridMap[row]?.[col]
        } else {
          return Math.abs(row - center) + Math.abs(col - center) <= center
        }
      }

      for (let col = 0; col < gridSize; col++) {
        let firstValidRow = -1
        for (let row = 0; row < gridSize; row++) {
          if (isValidCell(row, col)) {
            firstValidRow = row
            break
          }
        }

        if (firstValidRow === -1) continue

        let emptyCount = 0

        for (let row = gridSize - 1; row >= firstValidRow; row--) {
          if (!isValidCell(row, col)) continue

          const gem = this.board[row][col]
          if (!gem) {
            emptyCount++
          } else if (emptyCount > 0) {
            let dropRow = row + emptyCount
            while (dropRow < gridSize && !isValidCell(dropRow, col)) {
              dropRow++
            }
            if (dropRow < gridSize && isValidCell(dropRow, col)) {
              this.board[dropRow][col] = gem
              gem.setData("row", dropRow)
              this.board[row][col] = null
              this.tweens.add({
                targets: gem,
                y: startY + dropRow * tileSize,
                duration: 200,
              })
            }
          }
        }

        for (let i = 0; i < emptyCount; i++) {
          let targetRow = firstValidRow + i
          while (targetRow < gridSize && !isValidCell(targetRow, col)) {
            targetRow++
          }

          if (targetRow >= gridSize || !isValidCell(targetRow, col)) continue

          const type = Phaser.Math.Between(0, gemTypes - 1)
          const gem = this.add
            .sprite(startX + col * tileSize, startY - tileSize * (emptyCount - i), assetKey, type)
            .setDisplaySize(tileSize, tileSize)
            .setOrigin(0)
            .setInteractive() as GemSprite

          gem.setData("type", type)
          gem.setData("row", targetRow)
          gem.setData("col", col)

          // Fix this context issue
          const handleClick = (): void => {
            this.handleGemClick(gem)
          }
          gem.on("pointerdown", handleClick)

          this.board[targetRow][col] = gem
          this.tweens.add({
            targets: gem,
            y: startY + targetRow * tileSize,
            duration: 300,
          })
        }
      }

      this.time.delayedCall(350, () => {
        const matches = this.findMatchesMethod()
        if (matches.length > 0) this.removeMatchesMethod(matches)
      })
    }
  }
}
