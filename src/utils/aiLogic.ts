import { Board, checkWinner, checkDraw } from '@/hooks/useGameLogic';

export type Difficulty = 'easy' | 'medium' | 'hard';

const getEmptyCells = (board: Board): number[] => {
  return board.reduce<number[]>((acc, cell, index) => {
    if (cell === null) acc.push(index);
    return acc;
  }, []);
};

// Random move for Easy difficulty
const getRandomMove = (board: Board): number => {
  const emptyCells = getEmptyCells(board);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Minimax algorithm for Hard difficulty
const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number => {
  const { winner } = checkWinner(board);
  
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (checkDraw(board)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const cell of getEmptyCells(board)) {
      const newBoard = [...board];
      newBoard[cell] = 'O';
      const evaluation = minimax(newBoard, depth + 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const cell of getEmptyCells(board)) {
      const newBoard = [...board];
      newBoard[cell] = 'X';
      const evaluation = minimax(newBoard, depth + 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

const getBestMove = (board: Board): number => {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (const cell of getEmptyCells(board)) {
    const newBoard = [...board];
    newBoard[cell] = 'O';
    const score = minimax(newBoard, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }

  return bestMove;
};

// Medium difficulty: Mix of smart and random moves
const getMediumMove = (board: Board): number => {
  // 60% chance to make a smart move
  if (Math.random() < 0.6) {
    // Check if AI can win
    for (const cell of getEmptyCells(board)) {
      const newBoard = [...board];
      newBoard[cell] = 'O';
      if (checkWinner(newBoard).winner === 'O') {
        return cell;
      }
    }

    // Block player from winning
    for (const cell of getEmptyCells(board)) {
      const newBoard = [...board];
      newBoard[cell] = 'X';
      if (checkWinner(newBoard).winner === 'X') {
        return cell;
      }
    }

    // Take center if available
    if (board[4] === null) {
      return 4;
    }

    // Take a corner if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((c) => board[c] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
  }

  return getRandomMove(board);
};

export const getAIMove = (board: Board, difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return getRandomMove(board);
    case 'medium':
      return getMediumMove(board);
    case 'hard':
      return getBestMove(board);
    default:
      return getRandomMove(board);
  }
};
