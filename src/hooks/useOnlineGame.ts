import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkWinner, checkDraw, Player, Board, GameStatus } from './useGameLogic';

interface GameRoom {
  id: string;
  room_code: string;
  host_id: string | null;
  guest_id: string | null;
  host_name: string;
  guest_name: string;
  board: string[];
  current_player: string;
  winner: string | null;
  winning_line: number[] | null;
  status: string;
  host_score: number;
  guest_score: number;
  draws: number;
}

export type PlayerRole = 'host' | 'guest' | null;

export const useOnlineGame = () => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [playerRole, setPlayerRole] = useState<PlayerRole>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate unique player ID
  useEffect(() => {
    let id = localStorage.getItem('playerId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('playerId', id);
    }
    setPlayerId(id);
  }, []);

  // Generate a random 6-character room code
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Create a new room
  const createRoom = async (hostName: string = 'Player 1') => {
    if (!playerId) return null;
    
    setIsLoading(true);
    setError(null);

    try {
      const roomCode = generateRoomCode();
      
      const { data, error: insertError } = await supabase
        .from('game_rooms')
        .insert({
          room_code: roomCode,
          host_id: playerId,
          host_name: hostName,
          status: 'waiting',
          board: ['', '', '', '', '', '', '', '', ''],
          current_player: 'X',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setRoom(data);
      setPlayerRole('host');
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Join an existing room
  const joinRoom = async (roomCode: string, guestName: string = 'Player 2') => {
    if (!playerId) return null;
    
    setIsLoading(true);
    setError(null);

    try {
      // Find the room
      const { data: existingRoom, error: fetchError } = await supabase
        .from('game_rooms')
        .select()
        .eq('room_code', roomCode.toUpperCase())
        .single();

      if (fetchError) throw new Error('Room not found');
      if (!existingRoom) throw new Error('Room not found');
      if (existingRoom.guest_id) throw new Error('Room is full');
      if (existingRoom.host_id === playerId) throw new Error('You cannot join your own room');

      // Join the room
      const { data, error: updateError } = await supabase
        .from('game_rooms')
        .update({
          guest_id: playerId,
          guest_name: guestName,
          status: 'playing',
        })
        .eq('id', existingRoom.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setRoom(data);
      setPlayerRole('guest');
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Make a move
  const makeMove = async (index: number) => {
    if (!room || !playerRole) return false;

    // Check if it's this player's turn
    const isMyTurn = 
      (room.current_player === 'X' && playerRole === 'host') ||
      (room.current_player === 'O' && playerRole === 'guest');

    if (!isMyTurn) return false;
    if (room.board[index] !== '') return false;
    if (room.status !== 'playing') return false;

    const newBoard = [...room.board];
    newBoard[index] = room.current_player;

    // Check for winner
    const boardAsPlayer = newBoard.map(cell => cell === '' ? null : cell as Player);
    const result = checkWinner(boardAsPlayer);

    let updates: any = {
      board: newBoard,
      current_player: room.current_player === 'X' ? 'O' : 'X',
    };

    if (result.winner) {
      updates.winner = result.winner;
      updates.winning_line = result.winningLine;
      updates.status = 'finished';
      if (result.winner === 'X') {
        updates.host_score = room.host_score + 1;
      } else {
        updates.guest_score = room.guest_score + 1;
      }
    } else if (checkDraw(boardAsPlayer)) {
      updates.status = 'finished';
      updates.draws = room.draws + 1;
    }

    const { error: updateError } = await supabase
      .from('game_rooms')
      .update(updates)
      .eq('id', room.id);

    return !updateError;
  };

  // Reset the game for rematch
  const resetGame = async () => {
    if (!room) return;

    await supabase
      .from('game_rooms')
      .update({
        board: ['', '', '', '', '', '', '', '', ''],
        current_player: 'X',
        winner: null,
        winning_line: null,
        status: 'playing',
      })
      .eq('id', room.id);
  };

  // Leave the room
  const leaveRoom = async () => {
    if (!room) return;

    if (playerRole === 'host') {
      // Delete the room if host leaves
      await supabase
        .from('game_rooms')
        .delete()
        .eq('id', room.id);
    } else {
      // Just remove guest
      await supabase
        .from('game_rooms')
        .update({
          guest_id: null,
          guest_name: 'Player 2',
          status: 'waiting',
          board: ['', '', '', '', '', '', '', '', ''],
          current_player: 'X',
          winner: null,
          winning_line: null,
        })
        .eq('id', room.id);
    }

    setRoom(null);
    setPlayerRole(null);
  };

  // Subscribe to room changes
  useEffect(() => {
    if (!room?.id) return;

    const channel = supabase
      .channel(`room_${room.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setRoom(null);
            setPlayerRole(null);
            setError('Room was closed by the host');
          } else if (payload.new) {
            setRoom(payload.new as GameRoom);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

  // Computed values
  const board: Board = room?.board.map(cell => cell === '' ? null : cell as Player) || Array(9).fill(null);
  const currentPlayer: Player = (room?.current_player as Player) || 'X';
  const winner: Player = (room?.winner as Player) || null;
  const winningLine = room?.winning_line || null;
  const gameStatus: GameStatus = room?.status === 'finished' 
    ? (winner ? 'won' : 'draw') 
    : 'playing';
  const isMyTurn = room?.status === 'playing' && (
    (currentPlayer === 'X' && playerRole === 'host') ||
    (currentPlayer === 'O' && playerRole === 'guest')
  );
  const isWaiting = room?.status === 'waiting';

  return {
    room,
    playerRole,
    playerId,
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
  };
};
