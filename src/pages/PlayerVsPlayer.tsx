import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';
import GameStatusDisplay from '@/components/GameStatus';
import Confetti from '@/components/Confetti';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useState } from 'react';

const PlayerVsPlayer = () => {
  const {
    board,
    currentPlayer,
    winner,
    winningLine,
    gameStatus,
    scores,
    makeMove,
    resetGame,
    resetAll,
  } = useGameLogic();

  const [matchCount, setMatchCount] = useState(0);

  const handlePlayAgain = () => {
    resetGame();
    setMatchCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden">
      <Confetti trigger={gameStatus === 'won'} winner={winner} />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">
            <span className="neon-text">Player</span>
            <span className="text-muted-foreground"> vs </span>
            <span className="neon-text-magenta">Player</span>
          </h1>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePlayAgain} title="Restart Game">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Link to="/">
              <Button variant="ghost" size="icon" title="Home">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Score Board */}
        <div className="mb-8 sm:mb-12">
          <ScoreBoard 
            scores={scores} 
            currentPlayer={currentPlayer}
            playerXName="Player 1"
            playerOName="Player 2"
            winner={winner}
            gameStatus={gameStatus}
            matchCount={matchCount}
          />
        </div>

        {/* Game Status */}
        <div className="mb-6 sm:mb-8 min-h-[60px]">
          <GameStatusDisplay
            status={gameStatus}
            winner={winner}
            currentPlayer={currentPlayer}
          />
        </div>

        {/* Game Board */}
        <div className="mb-8 sm:mb-12">
          <GameBoard
            board={board}
            winningLine={winningLine}
            onCellClick={makeMove}
            disabled={gameStatus !== 'playing'}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {gameStatus !== 'playing' && (
            <Button variant="neon" size="lg" onClick={handlePlayAgain}>
              Play Again
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={() => { resetAll(); setMatchCount(0); }}>
            Reset Scores
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerVsPlayer;
