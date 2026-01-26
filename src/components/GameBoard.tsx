import { Board } from '@/hooks/useGameLogic';
import GameCell from './GameCell';

interface GameBoardProps {
  board: Board;
  winningLine: number[] | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

const GameBoard = ({ board, winningLine, onCellClick, disabled }: GameBoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[320px] sm:max-w-[380px] mx-auto">
      {board.map((cell, index) => (
        <GameCell
          key={index}
          index={index}
          value={cell}
          onClick={() => onCellClick(index)}
          isWinning={winningLine?.includes(index) || false}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default GameBoard;
