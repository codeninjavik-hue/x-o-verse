import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCodeInputProps {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (code: string, name: string) => void;
  isLoading: boolean;
  error: string | null;
}

const RoomCodeInput = ({ onCreateRoom, onJoinRoom, isLoading, error }: RoomCodeInputProps) => {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleCreate = () => {
    onCreateRoom(playerName || 'Player 1');
  };

  const handleJoin = () => {
    if (roomCode.length === 6) {
      onJoinRoom(roomCode.toUpperCase(), playerName || 'Player 2');
    }
  };

  if (mode === 'select') {
    return (
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-center">
          <span className="neon-text">Online</span>
          <span className="text-foreground"> Multiplayer</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Create a new room or join an existing one with a code
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button
            variant="neon"
            size="lg"
            className="flex-1 gap-2"
            onClick={() => setMode('create')}
          >
            <Plus className="w-5 h-5" />
            Create Room
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2"
            onClick={() => setMode('join')}
          >
            <Users className="w-5 h-5" />
            Join Room
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-scale-in w-full max-w-md mx-auto">
      <h2 className="text-2xl font-display font-bold">
        {mode === 'create' ? (
          <>
            <span className="text-primary">Create</span> New Room
          </>
        ) : (
          <>
            <span className="text-secondary">Join</span> Room
          </>
        )}
      </h2>

      <div className="w-full space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Your Name</label>
          <Input
            placeholder={mode === 'create' ? 'Player 1' : 'Player 2'}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="text-center text-lg"
            maxLength={20}
          />
        </div>

        {mode === 'join' && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Room Code</label>
            <Input
              placeholder="Enter 6-digit code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="text-center text-2xl font-mono tracking-[0.5em]"
              maxLength={6}
            />
          </div>
        )}

        {error && (
          <p className="text-destructive text-sm text-center animate-shake">
            {error}
          </p>
        )}

        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="lg"
            className="flex-1"
            onClick={() => setMode('select')}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            variant="neon"
            size="lg"
            className="flex-1"
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={isLoading || (mode === 'join' && roomCode.length !== 6)}
          >
            {isLoading ? 'Connecting...' : mode === 'create' ? 'Create' : 'Join'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface WaitingRoomProps {
  roomCode: string;
  hostName: string;
  guestName: string | null;
  isWaiting: boolean;
  onLeave: () => void;
}

export const WaitingRoom = ({ roomCode, hostName, guestName, isWaiting, onLeave }: WaitingRoomProps) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isWaiting) return null;

  return (
    <div className="flex flex-col items-center gap-6 animate-scale-in">
      <h2 className="text-xl sm:text-2xl font-display font-bold text-center">
        Waiting for opponent...
      </h2>
      
      <div className="game-card p-6 flex flex-col items-center gap-4">
        <p className="text-muted-foreground">Share this code with your friend:</p>
        
        <div className="flex items-center gap-4">
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.3em] text-primary">
            {roomCode}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyCode}
            className="transition-all duration-300"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Waiting for player to join...</span>
        </div>
      </div>

      <Button variant="outline" onClick={onLeave}>
        Cancel
      </Button>
    </div>
  );
};

export default RoomCodeInput;
