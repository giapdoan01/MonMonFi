"use client"
import { useEffect, useState, useRef } from "react"

const icons = ["🍒", "🍇", "🍋", "🍎", "🥝"]
const BOARD_SIZE = 8
const MAX_LEVEL = 3
const MAX_NEAR_MATCHES = 2

interface DamageEffect {
  id: string
  damage: number
  x: number
  y: number
  target: "player" | "enemy"
}

// Tìm các ô trùng
const findMatches = (board: string[][]): Set<string> => {
  const toClear = new Set<string>()

  // Hàng ngang
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - 2; c++) {
      const icon = board[r][c]
      if (icon && icon === board[r][c + 1] && icon === board[r][c + 2]) {
        toClear.add(`${r}-${c}`)
        toClear.add(`${r}-${c + 1}`)
        toClear.add(`${r}-${c + 2}`)
      }
    }
  }

  // Hàng dọc
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - 2; r++) {
      const icon = board[r][c]
      if (icon && icon === board[r + 1][c] && icon === board[r + 2][c]) {
        toClear.add(`${r}-${c}`)
        toClear.add(`${r + 1}-${c}`)
        toClear.add(`${r + 2}-${c}`)
      }
    }
  }

  return toClear
}

// Collapse bảng
const collapseBoard = (board: string[][]): string[][] => {
  const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(""))

  for (let c = 0; c < BOARD_SIZE; c++) {
    let writeRow = BOARD_SIZE - 1
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (board[r][c] !== "") {
        newBoard[writeRow][c] = board[r][c]
        writeRow--
      }
    }
  }

  return newBoard
}

// Refill
const refillBoard = (board: string[][]): string[][] => {
  return board.map((row) => row.map((cell) => (cell === "" ? icons[Math.floor(Math.random() * icons.length)] : cell)))
}

// Tính số lượng nước đi gần match
const countNearMatches = (b: string[][]): number => {
  let count = 0
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const dirs = [
        [0, 1],
        [1, 0],
      ]
      for (const [dr, dc] of dirs) {
        const nr = r + dr
        const nc = c + dc
        if (nr < BOARD_SIZE && nc < BOARD_SIZE) {
          const temp = b.map((row) => [...row])
          ;[temp[r][c], temp[nr][nc]] = [temp[nr][nc], temp[r][c]]
          const matched = findMatches(temp)
          if (matched.size > 0) count++
        }
      }
    }
  }
  return count
}

// Tạo board an toàn và khó hơn
const generateSafeBoard = (): string[][] => {
  let board: string[][]
  do {
    board = []
    for (let r = 0; r < BOARD_SIZE; r++) {
      const row: string[] = []
      for (let c = 0; c < BOARD_SIZE; c++) {
        const exclude = new Set<string>()
        if (r >= 1) exclude.add(board[r - 1][c])
        if (c >= 1) exclude.add(row[c - 1])
        const choices = icons.filter((icon) => !exclude.has(icon))
        const icon = choices[Math.floor(Math.random() * choices.length)]
        row.push(icon)
      }
      board.push(row)
    }
  } while (findMatches(board).size > 0 || countNearMatches(board) > MAX_NEAR_MATCHES)

  return board
}

export default function PureCSSGameScreen() {
  const [board, setBoard] = useState<string[][]>([])
  const [playerHP, setPlayerHP] = useState(100)
  const [enemyHP, setEnemyHP] = useState(100)
  const [level, setLevel] = useState(1)
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [matchingCells, setMatchingCells] = useState<Set<string>>(new Set())
  const [damageEffects, setDamageEffects] = useState<DamageEffect[]>([])
  const [playerMaxHP, setPlayerMaxHP] = useState(100)
  const [enemyMaxHP, setEnemyMaxHP] = useState(100)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)

  const gameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setBoard(generateSafeBoard())
    setPlayerHP(100)
    setEnemyHP(100)
    setPlayerMaxHP(100)
    setEnemyMaxHP(100)
    setIsPlayerTurn(true)
  }, [level])

  const showDamageEffect = (damage: number, target: "player" | "enemy") => {
    const id = Math.random().toString(36).substr(2, 9)
    const effect: DamageEffect = {
      id,
      damage,
      x: target === "player" ? 50 : window.innerWidth - 100,
      y: 150,
      target,
    }

    setDamageEffects((prev) => [...prev, effect])

    setTimeout(() => {
      setDamageEffects((prev) => prev.filter((e) => e.id !== id))
    }, 2000)
  }

  const handleCellClick = (r: number, c: number) => {
    if (!isPlayerTurn || isSwapping) return

    if (selected) {
      const [r0, c0] = selected
      const isAdjacent = (Math.abs(r - r0) === 1 && c === c0) || (Math.abs(c - c0) === 1 && r === r0)

      if (!isAdjacent) {
        setSelected(null)
        return
      }

      setIsSwapping(true)
      const newBoard = board.map((row) => [...row])
      ;[newBoard[r][c], newBoard[r0][c0]] = [newBoard[r0][c0], newBoard[r][c]]

      const matched = findMatches(newBoard)

      setTimeout(() => {
        setBoard(newBoard)
        setSelected(null)
        setIsSwapping(false)

        if (matched.size > 0) {
          setTimeout(() => {
            processMatch(newBoard, matched, "player")
          }, 300)
        } else {
          // Swap back if no match
          setTimeout(() => {
            setBoard(board)
            setTimeout(() => {
              setIsPlayerTurn(false)
              enemyPlay(board)
            }, 500)
          }, 300)
        }
      }, 400)
    } else {
      setSelected([r, c])
    }
  }

  const processMatch = (inputBoard: string[][], matches: Set<string>, attacker: "player" | "enemy") => {
    if (matches.size === 0) {
      if (attacker === "enemy") {
        const damage = 5
        const newHP = Math.max(playerHP - damage, 0)
        setPlayerHP(newHP)
        showDamageEffect(damage, "player")
        if (newHP === 0) {
          setTimeout(() => {
            alert("💀 Bạn đã bị quái đánh bại!")
            setLevel(1)
          }, 1000)
        }
      }
      setIsPlayerTurn(true)
      return
    }

    // Highlight matching cells
    setMatchingCells(matches)

    setTimeout(() => {
      const damage = matches.size
      if (attacker === "player") {
        const newHP = Math.max(enemyHP - damage, 0)
        setEnemyHP(newHP)
        showDamageEffect(damage, "enemy")
        if (newHP === 0) {
          setTimeout(() => {
            if (level < MAX_LEVEL) {
              alert(`✅ Hạ gục quái Lv.${level}! Sang màn ${level + 1}`)
              setLevel(level + 1)
            } else {
              alert("🏆 Bạn đã chiến thắng toàn bộ!")
              setLevel(1)
            }
          }, 1000)
          return
        }
      }

      const clearedBoard = inputBoard.map((row, r) => row.map((cell, c) => (matches.has(`${r}-${c}`) ? "" : cell)))

      const collapsed = collapseBoard(clearedBoard)
      const refilled = refillBoard(collapsed)

      setBoard(refilled)
      setMatchingCells(new Set())

      const newMatches = findMatches(refilled)

      setTimeout(() => {
        processMatch(refilled, newMatches, attacker)
      }, 600)
    }, 800)
  }

  const enemyPlay = (currentBoard: string[][]) => {
    let bestSwap: [number, number, number, number] | null = null
    let maxMatch = 0

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const directions = [
          [0, 1],
          [1, 0],
        ]

        for (const [dr, dc] of directions) {
          const r2 = r + dr
          const c2 = c + dc
          if (r2 >= BOARD_SIZE || c2 >= BOARD_SIZE) continue

          const temp = currentBoard.map((row) => [...row])
          ;[temp[r][c], temp[r2][c2]] = [temp[r2][c2], temp[r][c]]
          const matched = findMatches(temp).size

          if (matched > maxMatch) {
            maxMatch = matched
            bestSwap = [r, c, r2, c2]
          }
        }
      }
    }

    if (bestSwap) {
      const [r1, c1, r2, c2] = bestSwap
      const newBoard = currentBoard.map((row) => [...row])
      ;[newBoard[r1][c1], newBoard[r2][c2]] = [newBoard[r2][c2], newBoard[r1][c1]]
      setBoard(newBoard)

      setTimeout(() => {
        const matched = findMatches(newBoard)
        processMatch(newBoard, matched, "enemy")
      }, 400)
    } else {
      // Không tìm thấy nước đi, gây sát thương nhẹ
      const damage = 3
      setPlayerHP((prev) => Math.max(prev - damage, 0))
      showDamageEffect(damage, "player")
      setIsPlayerTurn(true)
    }
  }

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      position: "relative" as const,
    },
    gameWrapper: {
      maxWidth: "900px",
      margin: "0 auto",
      position: "relative" as const,
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "15px",
      padding: "20px",
      marginBottom: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    header: {
      textAlign: "center" as const,
      margin: 0,
      fontSize: "2.5rem",
      color: "#333",
      textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    },
    levelText: {
      textAlign: "center" as const,
      fontSize: "1.2rem",
      color: "#6366f1",
      fontWeight: "bold",
      marginTop: "10px",
    },
    // Player Health - Left Side
    playerHealthContainer: {
      position: "fixed" as const,
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 100,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(10px)",
      border: "2px solid rgba(34, 197, 94, 0.3)",
    },
    // Enemy Health - Right Side
    enemyHealthContainer: {
      position: "fixed" as const,
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 100,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(10px)",
      border: "2px solid rgba(239, 68, 68, 0.3)",
    },
    healthSection: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "15px",
    },
    avatar: {
      fontSize: "4rem",
      filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.3))",
      animation: "float 3s ease-in-out infinite",
    },
    healthBarContainer: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "10px",
    },
    healthLabel: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#555",
      textAlign: "center" as const,
    },
    healthBarOuter: {
      width: "120px",
      height: "25px",
      backgroundColor: "#e5e7eb",
      borderRadius: "12px",
      overflow: "hidden",
      border: "3px solid #9ca3af",
      position: "relative" as const,
    },
    healthBarInner: {
      height: "100%",
      transition: "width 1s ease-out",
      borderRadius: "9px",
      position: "relative" as const,
    },
    playerHealthBar: {
      background: "linear-gradient(90deg, #10b981, #059669)",
      boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3)",
    },
    enemyHealthBar: {
      background: "linear-gradient(90deg, #ef4444, #dc2626)",
      boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3)",
    },
    healthText: {
      fontSize: "0.9rem",
      fontWeight: "bold",
      color: "#374151",
      textAlign: "center" as const,
    },
    boardContainer: {
      position: "relative" as const,
      marginTop: "20px",
    },
    board: {
      display: "grid",
      gridTemplateColumns: `repeat(${BOARD_SIZE}, 50px)`,
      gap: "8px",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: `${BOARD_SIZE * 58}px`,
    },
    cell: {
      width: "50px",
      height: "50px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "2px solid rgba(255, 255, 255, 0.8)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      background: "linear-gradient(135deg, #e0f2fe, #b3e5fc)",
      userSelect: "none" as const,
    },
    cellSelected: {
      background: "linear-gradient(135deg, #ffd54f, #ffb300)",
      transform: "scale(1.1)",
      boxShadow: "0 4px 16px rgba(255, 193, 7, 0.5)",
      border: "3px solid #ff8f00",
    },
    cellMatching: {
      background: "linear-gradient(135deg, #ff8a80, #ff5722)",
      transform: "scale(1.05)",
      animation: "matchPulse 0.8s ease-in-out infinite",
    },
    turnIndicator: {
      textAlign: "center" as const,
      marginTop: "20px",
    },
    turnBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "12px 24px",
      borderRadius: "25px",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
    playerTurnBadge: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "2px solid #bbf7d0",
      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
    },
    enemyTurnBadge: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "2px solid #fecaca",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    },
    damageEffect: {
      position: "fixed" as const,
      pointerEvents: "none" as const,
      zIndex: 1000,
      fontWeight: "bold",
      fontSize: "2.2rem",
      animation: "damageFloat 2s ease-out forwards",
      textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
    },
    playerDamage: {
      color: "#dc2626",
    },
    enemyDamage: {
      color: "#ea580c",
    },
  }

  return (
    <div style={styles.container}>
      {/* Player Health - Left Side */}
      <div style={styles.playerHealthContainer}>
        <div style={styles.healthSection}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.healthBarContainer}>
            <div style={styles.healthLabel}>PLAYER</div>
            <div style={styles.healthBarOuter}>
              <div
                style={{
                  ...styles.healthBarInner,
                  ...styles.playerHealthBar,
                  width: `${(playerHP / playerMaxHP) * 100}%`,
                }}
              />
            </div>
            <div style={styles.healthText}>
              {playerHP}/{playerMaxHP}
            </div>
          </div>
        </div>
      </div>

      {/* Enemy Health - Right Side */}
      <div style={styles.enemyHealthContainer}>
        <div style={styles.healthSection}>
          <div style={styles.avatar}>👾</div>
          <div style={styles.healthBarContainer}>
            <div style={styles.healthLabel}>ENEMY LV.{level}</div>
            <div style={styles.healthBarOuter}>
              <div
                style={{
                  ...styles.healthBarInner,
                  ...styles.enemyHealthBar,
                  width: `${(enemyHP / enemyMaxHP) * 100}%`,
                }}
              />
            </div>
            <div style={styles.healthText}>
              {enemyHP}/{enemyMaxHP}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.gameWrapper} ref={gameRef}>
        {/* Header */}
        <div style={styles.card}>
          <h1 style={styles.header}>⚔️ Match-3 RPG Battle</h1>
          <div style={styles.levelText}>
            Level {level} {!isPlayerTurn && "- Enemy Turn"}
          </div>
        </div>

        {/* Game Board */}
        <div style={styles.card}>
          <div style={styles.boardContainer}>
            <div style={styles.board}>
              {board.map((row, r) =>
                row.map((icon, c) => {
                  const isSelected = selected?.[0] === r && selected?.[1] === c
                  const isMatching = matchingCells.has(`${r}-${c}`)

                  let cellStyle = { ...styles.cell }

                  if (isSelected) {
                    cellStyle = { ...cellStyle, ...styles.cellSelected }
                  } else if (isMatching) {
                    cellStyle = { ...cellStyle, ...styles.cellMatching }
                  }

                  if (isSwapping) {
                    cellStyle.pointerEvents = "none"
                  }

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      style={cellStyle}
                      onMouseEnter={(e) => {
                        if (!isSelected && !isMatching && !isSwapping) {
                          e.currentTarget.style.transform = "scale(1.05)"
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected && !isMatching) {
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)"
                        }
                      }}
                    >
                      <span style={{ filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.3))" }}>{icon}</span>
                    </div>
                  )
                }),
              )}
            </div>

            {/* Turn Indicator */}
            <div style={styles.turnIndicator}>
              <div
                style={{
                  ...styles.turnBadge,
                  ...(isPlayerTurn ? styles.playerTurnBadge : styles.enemyTurnBadge),
                }}
              >
                {isPlayerTurn ? "🎯 Your Turn" : "⏳ Enemy Turn"}
              </div>
            </div>
          </div>
        </div>

        {/* Damage Effects */}
        {damageEffects.map((effect) => (
          <div
            key={effect.id}
            style={{
              ...styles.damageEffect,
              ...(effect.target === "player" ? styles.playerDamage : styles.enemyDamage),
              left: effect.x,
              top: effect.y,
            }}
          >
            -{effect.damage}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes matchPulse {
          0%, 100% { 
            transform: scale(1.05); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.15); 
            opacity: 0.8;
          }
        }
        
        @keyframes damageFloat {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1.3);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
