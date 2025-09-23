"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../styles/minesweeper.module.scss";

type Cell = {
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
};

const BOARD_SIZE = 10;
const MINE_COUNT = 15;

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetBoard();
  }, []);

  useEffect(() => {
    if (!gameOver && !gameWon && board.length > 0) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [board, gameOver, gameWon]);

  function resetBoard() {
    const newBoard: Cell[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => ({
        isMine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (newBoard[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (
              r + dr < 0 ||
              r + dr >= BOARD_SIZE ||
              c + dc < 0 ||
              c + dc >= BOARD_SIZE
            )
              continue;
            if (newBoard[r + dr][c + dc].isMine) count++;
          }
        }
        newBoard[r][c].adjacentMines = count;
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setFlags(0);
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function revealCell(r: number, c: number) {
    if (gameOver || gameWon) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    const queue: [number, number][] = [[r, c]];

    while (queue.length > 0) {
      const [row, col] = queue.pop()!;
      const cell = newBoard[row][col];

      if (cell.revealed || cell.flagged) continue;
      cell.revealed = true;

      if (cell.isMine) {
        setGameOver(true);
        setBoard(newBoard);
        return;
      }

      if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE)
              continue;
            if (!newBoard[nr][nc].revealed && !newBoard[nr][nc].isMine) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    const allSafeRevealed = newBoard
      .flat()
      .every(cell => cell.isMine || cell.revealed);
    if (allSafeRevealed) setGameWon(true);

    setBoard(newBoard);
  }

  function toggleFlag(r: number, c: number, e: React.MouseEvent) {
    e.preventDefault();
    if (gameOver || gameWon) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[r][c];
    if (!cell.revealed) {
      cell.flagged = !cell.flagged;
      setFlags(prev => prev + (cell.flagged ? 1 : -1));
    }
    setBoard(newBoard);
  }

  return (
    <div className={styles.minesweeper}>
      <div className={styles.infoBar}>
        <span className={styles.left}>
          Mines Left: {MINE_COUNT - board.flat().filter(c => c.flagged).length}
        </span>

        <span className={styles.center}>
          {gameOver && <span className={styles.gameOver}>Game Over!</span>}
          {gameWon && <span className={styles.gameWon}>You Win!</span>}
        </span>

        <span className={styles.right}>Time: {time}s</span>
      </div>

      <div className={styles.board}>
        {board.map((row, r) => (
          <div key={r} className={styles.row}>
            {row.map((cell, c) => (
              <div
                key={c}
                className={`${styles.cell} 
                  ${cell.revealed ? styles.revealed : ""} 
                  ${cell.flagged ? styles.flagged : ""}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={e => toggleFlag(r, c, e)}>
                {cell.revealed
                  ? cell.isMine
                    ? "💣"
                    : cell.adjacentMines > 0
                    ? cell.adjacentMines
                    : ""
                  : cell.flagged
                  ? "🚩"
                  : ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button onClick={resetBoard} className={styles.restartButton}>
          Restart
        </button>
      </div>
    </div>
  );
}
