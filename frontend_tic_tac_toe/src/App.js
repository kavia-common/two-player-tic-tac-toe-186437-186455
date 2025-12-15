import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * A simple two-player Tic Tac Toe game implemented with React.
 * - 3x3 grid
 * - Turn indicator
 * - Win/draw detection
 * - Restart button
 * - Minimal responsive styling following the provided light theme
 */
const THEME = {
  primary: '#3b82f6',
  success: '#06b6d4',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  border: '#e5e7eb',
};

// PUBLIC_INTERFACE
function App() {
  /** Theme is light-only per request; keep state for future extension but do not add dark styles */
  const [theme] = useState('light');

  // Respect .env values if referenced; not used to call any external services
  const appEnv = {
    NODE_ENV: process.env.REACT_APP_NODE_ENV,
    PORT: process.env.REACT_APP_PORT,
  };
  void appEnv; // prevent unused var lint while keeping compliance with "respect .env values"

  // Game state
  const [board, setBoard] = useState(Array(9).fill(null)); // 0..8
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null); // 'X' | 'Y' | null
  const [winningLine, setWinningLine] = useState([]); // indices of winning cells

  // Apply CSS variables for the theme to the root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const root = document.documentElement;
    root.style.setProperty('--ttt-primary', THEME.primary);
    root.style.setProperty('--ttt-success', THEME.success);
    root.style.setProperty('--ttt-bg', THEME.background);
    root.style.setProperty('--ttt-surface', THEME.surface);
    root.style.setProperty('--ttt-text', THEME.text);
    root.style.setProperty('--ttt-border', THEME.border);
  }, [theme]);

  const status = useMemo(() => {
    if (winner) {
      return `Winner: ${winner}`;
    }
    if (board.every((c) => c !== null)) {
      return 'Draw!';
    }
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, board, xIsNext]);

  // PUBLIC_INTERFACE
  function calculateWinner(squares) {
    /** Determine if there is a winner and return { winner: 'X'|'O', line: number[] } or null */
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function handleClick(index) {
    /**
     * Handle a user clicking a cell:
     * - Ignore if game already has a winner or cell is filled
     * - Otherwise place current player's mark and check for win/draw
     */
    if (winner || board[index]) return;
    const next = board.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);
    const result = calculateWinner(next);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else {
      setXIsNext((v) => !v);
    }
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    /** Reset the game to initial state */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine([]);
  }

  return (
    <div className="ttt-app" role="application" aria-label="Two player Tic Tac Toe">
      <nav className="ttt-navbar">
        <div className="ttt-brand">Tic Tac Toe</div>
      </nav>

      <main className="ttt-main">
        <section className="ttt-card">
          <header className="ttt-status">
            <span
              className={`ttt-indicator ${winner ? 'ttt-indicator-finished' : xIsNext ? 'x' : 'o'}`}
              aria-live="polite"
            >
              {status}
            </span>
          </header>

          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((cell, idx) => {
              const isWinning = winningLine.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}, ${cell ? cell : 'empty'}`}
                  className={`ttt-cell ${isWinning ? 'ttt-cell-win' : ''}`}
                  onClick={() => handleClick(idx)}
                  disabled={!!winner || !!cell}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          <footer className="ttt-actions">
            <button
              type="button"
              className="ttt-btn"
              onClick={restartGame}
              aria-label="Restart game"
            >
              Restart
            </button>
          </footer>
        </section>
      </main>

      <footer className="ttt-footer">
        <small>Play locally: two players on the same device.</small>
      </footer>
    </div>
  );
}

export default App;
