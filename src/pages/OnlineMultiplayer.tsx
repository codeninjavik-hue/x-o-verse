import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';
import GameStatusDisplay from '@/components/GameStatus';
import RoomCodeInput, { WaitingRoom } from '@/components/RoomCodeInput';
import Confetti from '@/components/Confetti';
import { useOnlineGame } from '@/hooks/useOnlineGame';

const OnlineMultiplayer = () => {
  const {
    room,
    playerRole,
    isLoading,
    error,
    board,
    currentPlayer,
    winner,
    winningLine,
    gameStatus,
    isMyTurn,
    isWaiting,
    createRoom,
    joinRoom,
    makeMove,
    resetGame,
    leaveRoom,
    setError,
  } = useOnlineGame();

  // Show room code input if not in a room
  if (!room) {
    return (
      <div className="min-h-screen grid-pattern relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <RoomCodeInput
            onCreateRoom={createRoom}
            onJoinRoom={joinRoom}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    );
  }

  // Show waiting room if waiting for opponent
  if (isWaiting) {
    return (
      <div className="min-h-screen grid-pattern relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4">
          <WaitingRoom
            roomCode={room.room_code}
            hostName={room.host_name}
            guestName={room.guest_name}
            isWaiting={isWaiting}
            onLeave={leaveRoom}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden">
      {/* Confetti on win */}
      <Confetti trigger={gameStatus === 'won'} winner={winner} />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <Button variant="ghost" size="sm" className="gap-2" onClick={leaveRoom}>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </Button>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">
              <span className="text-accent">Online</span>
              <span className="text-foreground"> Game</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Room:</span>
              <span className="text-sm font-mono text-primary">{room.room_code}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {gameStatus !== 'playing' && (
              <Button variant="outline" size="icon" onClick={resetGame} title="Restart Game">
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
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
            scores={{ X: room.host_score, O: room.guest_score }}
            currentPlayer={currentPlayer}
            playerXName={room.host_name}
            playerOName={room.guest_name}
          />
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">Draws: {room.draws}</span>
          </div>
        </div>

        {/* Turn Indicator */}
        <div className="mb-6 sm:mb-8 min-h-[60px]">
          {gameStatus === 'playing' ? (
            <div className="text-center">
              {isMyTurn ? (
                <p className="text-xl sm:text-2xl font-display text-primary animate-pulse">
                  Your Turn! 🎯
                </p>
              ) : (
                <p className="text-xl sm:text-2xl font-display text-muted-foreground animate-thinking">
                  Waiting for opponent...
                </p>
              )}
            </div>
          ) : (
            <GameStatusDisplay
              status={gameStatus}
              winner={winner}
              currentPlayer={currentPlayer}
            />
          )}
        </div>

        {/* Game Board */}
        <div className="mb-8 sm:mb-12">
          <GameBoard
            board={board}
            winningLine={winningLine}
            onCellClick={makeMove}
            disabled={!isMyTurn || gameStatus !== 'playing'}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {gameStatus !== 'playing' && (
            <Button variant="neon" size="lg" onClick={resetGame}>
              Play Again
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={leaveRoom}>
            Leave Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnlineMultiplayer;
