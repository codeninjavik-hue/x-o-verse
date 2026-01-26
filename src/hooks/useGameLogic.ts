import { useState, useCallback } from 'react';

export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type GameStatus = 'playing' | 'won' | 'draw';

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Anti-diagonal
];

export const checkWinner = (board: Board): { winner: Player; winningLine: number[] | null } => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: combination };
    }
  }
  return { winner: null, winningLine: null };
};

export const checkDraw = (board: Board): boolean => {
  return board.every((cell) => cell !== null);
};

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  winningLine: number[] | null;
  gameStatus: GameStatus;
  scores: { X: number; O: number };
}

export const useGameLogic = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const makeMove = useCallback((index: number): boolean => {
    if (board[index] || winner || gameStatus !== 'playing') {
      return false;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.winningLine);
      setGameStatus('won');
      setScores((prev) => ({
        ...prev,
        [result.winner as 'X' | 'O']: prev[result.winner as 'X' | 'O'] + 1,
      }));
      return true;
    }

    if (checkDraw(newBoard)) {
      setGameStatus('draw');
      return true;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    return true;
  }, [board, currentPlayer, winner, gameStatus]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setGameStatus('playing');
  }, []);

  const resetAll = useCallback(() => {
    resetGame();
    setScores({ X: 0, O: 0 });
  }, [resetGame]);

  return {
    board,
    currentPlayer,
    winner,
    winningLine,
    gameStatus,
    scores,
    makeMove,
    resetGame,
    resetAll,
    setCurrentPlayer,
    setBoard,
    setWinner,
    setWinningLine,
    setGameStatus,
    setScores,
  };
};
