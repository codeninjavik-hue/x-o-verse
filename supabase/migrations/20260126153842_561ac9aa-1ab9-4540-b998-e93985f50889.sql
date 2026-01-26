-- Create game_rooms table for online multiplayer
CREATE TABLE public.game_rooms (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_code VARCHAR(6) NOT NULL UNIQUE,
    host_id UUID,
    guest_id UUID,
    host_name VARCHAR(50) DEFAULT 'Player 1',
    guest_name VARCHAR(50) DEFAULT 'Player 2',
    board TEXT[] DEFAULT ARRAY['', '', '', '', '', '', '', '', ''],
    current_player VARCHAR(1) DEFAULT 'X',
    winner VARCHAR(1),
    winning_line INTEGER[],
    status VARCHAR(20) DEFAULT 'waiting', -- waiting, playing, finished
    host_score INTEGER DEFAULT 0,
    guest_score INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for game rooms (public access for multiplayer)
CREATE POLICY "Anyone can view game rooms" 
ON public.game_rooms 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create game rooms" 
ON public.game_rooms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update game rooms" 
ON public.game_rooms 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete game rooms" 
ON public.game_rooms 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_game_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_game_rooms_updated_at
BEFORE UPDATE ON public.game_rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_game_rooms_updated_at();

-- Enable realtime for game_rooms table
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;