import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Color palette for quick reference:
 * Primary:   #1976D2
 * Secondary: #2196F3
 * Accent:    #FFC107
 */

// Square Component
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** Renders a single interactive board cell. */
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// Board Component
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /** Renders the 3x3 grid of squares. */
  function renderSquare(i) {
    const isWinner = winningLine?.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isWinner}
      />
    );
  }

  // Board rows
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}

// Determine winner or tie
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns [winner, winningLine] or [null, null] if no winner. */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return [squares[a], line];
    }
  }
  return [null, null];
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App component for the Tic Tac Toe game.
   * Implements game mechanics, score, restart, and layout.
   */

  // State
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, Ties: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);

  // Reset only board (not score)
  // PUBLIC_INTERFACE
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinningLine(null);
  }

  // Handle click on square
  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (squares[idx] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
  }

  // Side effect: Check for winner/tie whenever board changes
  useEffect(() => {
    const [winner, line] = calculateWinner(squares);
    const isBoardFull = squares.every(cell => cell);

    if (winner) {
      setGameOver(true);
      setWinningLine(line);
      setScore(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    } else if (isBoardFull) {
      setGameOver(true);
      setWinningLine(null);
      setScore(prev => ({
        ...prev,
        Ties: prev.Ties + 1
      }));
    } else {
      setXIsNext(prev => prev); // keep current player's turn
    }
  // eslint-disable-next-line
  }, [squares]);

  // After gameOver, always let the last player show as the winner, otherwise show whose turn it is.
  let status;
  const [winner] = calculateWinner(squares);
  if (winner) {
    status = (
      <span>
        <span className="accent">{winner} wins!</span>
      </span>
    );
  } else if (gameOver) {
    status = (
      <span>
        <span className="accent">Tie game!</span>
      </span>
    );
  } else {
    status = (
      <>
        Next move:
        <span className="primary"> {xIsNext ? "X" : "O"}</span>
      </>
    );
  }

  // Set theme colors on root: override App.css with palette
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--primary', '#1976D2');
    r.style.setProperty('--secondary', '#2196F3');
    r.style.setProperty('--accent', '#FFC107');
    r.style.setProperty('--app-bg', '#fff');
    r.style.setProperty('--square-bg', '#f7fafd');
    r.style.setProperty('--square-border', '#e0e3eb');
    r.style.setProperty('--board-shadow', '0 3px 24px 0 rgba(25, 118, 210, 0.07)');
    r.style.setProperty('--score-bg', '#f4f6fb');
  }, []);

  // After game ends, prevent further moves; disables already handled above

  return (
    <div className="ttt-app-container">
      <main className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <Board
          squares={squares}
          onSquareClick={idx => {
            if (!gameOver && !squares[idx]) {
              handleSquareClick(idx);
              setXIsNext(!xIsNext);
            }
          }}
          winningLine={winningLine}
        />
        <div className="ttt-status">{status}</div>
        <button className="ttt-btn ttt-btn-restart" onClick={restartGame} aria-label="Restart Game">
          Restart Game
        </button>
        <div className="ttt-scoreboard">
          <div className="score score-x">
            X
            <div className="score-box">{score.X}</div>
          </div>
          <div className="score score-o">
            O
            <div className="score-box">{score.O}</div>
          </div>
          <div className="score score-tie">
            <span>Ties</span>
            <div className="score-box">{score.Ties}</div>
          </div>
        </div>
        <footer className="ttt-footer">
          <span className="credit">
            A modern&nbsp;<span style={{ color: 'var(--secondary)' }}>React</span>&nbsp;demo
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
