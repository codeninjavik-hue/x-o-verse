import {
  Grid3X3, Crown, CircleDot, Dice5, Bug, Target,
  Puzzle, Gamepad2, Swords, Zap, Brain, Star,
  Heart, Spade, Diamond, Club, Layers, SquareStack,
  Timer, Bomb, ArrowUp, Sparkles, Rocket, Ghost,
  Shield, Navigation, Crosshair, Move, Hash, Boxes,
  CircleDashed, Grip, LayoutGrid, Binary, Hexagon,
  Triangle, Pentagon, Octagon, Gem, Flame, Snowflake,
  Sun, Moon, Wind, Waves, Mountain, TreePine, Flower2,
  Fish, Bird, Squirrel, Cat
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type GameCategory = 'board' | 'card' | 'puzzle' | 'arcade' | 'strategy' | 'unique';

export interface GameItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: GameCategory;
  accentColor: 'cyan' | 'magenta' | 'purple' | 'green' | 'orange';
  route?: string; // undefined = coming soon
  isNew?: boolean;
  isHot?: boolean;
}

export const categories: { id: GameCategory; label: string; icon: LucideIcon }[] = [
  { id: 'board', label: 'Board Games', icon: Grid3X3 },
  { id: 'card', label: 'Card Games', icon: Spade },
  { id: 'puzzle', label: 'Puzzle Games', icon: Puzzle },
  { id: 'arcade', label: 'Arcade Games', icon: Gamepad2 },
  { id: 'strategy', label: 'Strategy Games', icon: Swords },
  { id: 'unique', label: 'Unique Games', icon: Sparkles },
];

export const gamesList: GameItem[] = [
  // ===== BOARD GAMES =====
  { id: 'tic-tac-toe-pvp', title: 'Tic Tac Toe PvP', description: 'Classic X vs O - Local multiplayer', icon: Grid3X3, category: 'board', accentColor: 'cyan', route: '/pvp', isHot: true },
  { id: 'tic-tac-toe-ai', title: 'Tic Tac Toe vs AI', description: 'Challenge the robot brain', icon: Grid3X3, category: 'board', accentColor: 'magenta', route: '/ai', isHot: true },
  { id: 'tic-tac-toe-online', title: 'Tic Tac Toe Online', description: 'Play online with room codes', icon: Grid3X3, category: 'board', accentColor: 'purple', route: '/online', isHot: true },
  { id: 'chess', title: 'Chess', description: 'The king of strategy games', icon: Crown, category: 'board', accentColor: 'purple', route: '/games/chess', isNew: true },
  { id: 'ludo', title: 'Ludo', description: 'Roll dice and race to finish', icon: Dice5, category: 'board', accentColor: 'green', route: '/games/ludo', isNew: true },
  { id: 'snake-ladders', title: 'Snake & Ladders', description: 'Climb up, slide down!', icon: Bug, category: 'board', accentColor: 'orange', route: '/games/snake-ladders', isNew: true },
  { id: 'carrom', title: 'Carrom Board', description: 'Flick and pocket the coins', icon: Target, category: 'board', accentColor: 'cyan', route: '/games/carrom', isNew: true },
  { id: 'checkers', title: 'Checkers', description: 'Jump and capture all pieces', icon: CircleDot, category: 'board', accentColor: 'magenta' },
  { id: 'connect-four', title: 'Connect Four', description: 'Drop discs, connect 4 in a row', icon: Layers, category: 'board', accentColor: 'orange' },
  { id: 'othello', title: 'Othello/Reversi', description: 'Flip and dominate the board', icon: CircleDashed, category: 'board', accentColor: 'green' },
  { id: 'mancala', title: 'Mancala', description: 'Ancient stone-sowing game', icon: Grip, category: 'board', accentColor: 'purple' },
  { id: 'backgammon', title: 'Backgammon', description: 'Classic dice and strategy', icon: Dice5, category: 'board', accentColor: 'cyan' },

  // ===== CARD GAMES =====
  { id: 'memory-match', title: 'Memory Match', description: 'Flip cards and find pairs', icon: Brain, category: 'card', accentColor: 'cyan' },
  { id: 'solitaire', title: 'Solitaire', description: 'Classic card patience game', icon: Spade, category: 'card', accentColor: 'green' },
  { id: 'blackjack', title: 'Blackjack', description: 'Hit or stand - reach 21!', icon: Club, category: 'card', accentColor: 'magenta' },
  { id: 'poker', title: 'Poker', description: 'Texas Hold\'em style', icon: Diamond, category: 'card', accentColor: 'orange' },
  { id: 'uno', title: 'UNO', description: 'Match colors and numbers', icon: SquareStack, category: 'card', accentColor: 'purple' },
  { id: 'crazy-eights', title: 'Crazy Eights', description: 'Play eights to change suit', icon: Octagon, category: 'card', accentColor: 'cyan' },
  { id: 'hearts', title: 'Hearts', description: 'Avoid hearts and queen of spades', icon: Heart, category: 'card', accentColor: 'magenta' },
  { id: 'go-fish', title: 'Go Fish', description: 'Ask for cards, make pairs', icon: Fish, category: 'card', accentColor: 'green' },
  { id: 'war', title: 'War', description: 'Highest card wins the round', icon: Swords, category: 'card', accentColor: 'orange' },
  { id: 'snap', title: 'Snap', description: 'Be fastest to match cards', icon: Zap, category: 'card', accentColor: 'purple' },

  // ===== PUZZLE GAMES =====
  { id: '2048', title: '2048', description: 'Slide and merge numbers', icon: Hash, category: 'puzzle', accentColor: 'orange' },
  { id: 'sudoku', title: 'Sudoku', description: 'Fill the 9x9 grid', icon: LayoutGrid, category: 'puzzle', accentColor: 'cyan' },
  { id: 'minesweeper', title: 'Minesweeper', description: 'Find mines without exploding', icon: Bomb, category: 'puzzle', accentColor: 'magenta' },
  { id: 'sliding-puzzle', title: 'Sliding Puzzle', description: 'Slide tiles into order', icon: Move, category: 'puzzle', accentColor: 'green' },
  { id: 'word-search', title: 'Word Search', description: 'Find hidden words in grid', icon: Binary, category: 'puzzle', accentColor: 'purple' },
  { id: 'crossword', title: 'Crossword', description: 'Fill words from clues', icon: Grid3X3, category: 'puzzle', accentColor: 'orange' },
  { id: 'nonogram', title: 'Nonogram', description: 'Picture logic puzzle', icon: Boxes, category: 'puzzle', accentColor: 'cyan' },
  { id: 'jigsaw', title: 'Jigsaw Puzzle', description: 'Piece together the image', icon: Puzzle, category: 'puzzle', accentColor: 'magenta' },
  { id: 'tower-of-hanoi', title: 'Tower of Hanoi', description: 'Move discs between pegs', icon: Triangle, category: 'puzzle', accentColor: 'green' },
  { id: 'lights-out', title: 'Lights Out', description: 'Toggle lights to turn all off', icon: Sun, category: 'puzzle', accentColor: 'purple' },

  // ===== ARCADE GAMES =====
  { id: 'snake-game', title: 'Snake', description: 'Eat and grow without crashing', icon: Bug, category: 'arcade', accentColor: 'green' },
  { id: 'pong', title: 'Pong', description: 'Classic paddle ball game', icon: Gamepad2, category: 'arcade', accentColor: 'cyan' },
  { id: 'breakout', title: 'Breakout', description: 'Break all the bricks', icon: Flame, category: 'arcade', accentColor: 'orange' },
  { id: 'flappy', title: 'Flappy Bird', description: 'Fly through the pipes', icon: Bird, category: 'arcade', accentColor: 'magenta' },
  { id: 'space-invaders', title: 'Space Invaders', description: 'Shoot the alien invasion', icon: Rocket, category: 'arcade', accentColor: 'purple' },
  { id: 'pacman', title: 'Pac-Man', description: 'Eat dots, avoid ghosts', icon: Ghost, category: 'arcade', accentColor: 'cyan' },
  { id: 'asteroids', title: 'Asteroids', description: 'Blast space rocks', icon: Star, category: 'arcade', accentColor: 'orange' },
  { id: 'frogger', title: 'Frogger', description: 'Cross the road safely', icon: Squirrel, category: 'arcade', accentColor: 'green' },
  { id: 'doodle-jump', title: 'Doodle Jump', description: 'Jump higher and higher', icon: ArrowUp, category: 'arcade', accentColor: 'magenta' },
  { id: 'whack-a-mole', title: 'Whack-a-Mole', description: 'Hit the moles fast!', icon: Cat, category: 'arcade', accentColor: 'purple' },

  // ===== STRATEGY GAMES =====
  { id: 'battleship', title: 'Battleship', description: 'Sink your opponent\'s fleet', icon: Navigation, category: 'strategy', accentColor: 'cyan' },
  { id: 'dots-boxes', title: 'Dots & Boxes', description: 'Complete boxes to score', icon: Boxes, category: 'strategy', accentColor: 'magenta' },
  { id: 'nim', title: 'Nim', description: 'Take objects, avoid last one', icon: Hexagon, category: 'strategy', accentColor: 'green' },
  { id: 'tower-defense', title: 'Tower Defense', description: 'Build towers to stop enemies', icon: Shield, category: 'strategy', accentColor: 'orange' },
  { id: 'tic-tac-ultimate', title: 'Ultimate Tic Tac Toe', description: '9 boards in one mega game', icon: Grid3X3, category: 'strategy', accentColor: 'purple' },
  { id: 'hex', title: 'Hex', description: 'Connect sides of the hex grid', icon: Hexagon, category: 'strategy', accentColor: 'cyan' },
  { id: 'quarto', title: 'Quarto', description: 'Choose pieces for your opponent', icon: Pentagon, category: 'strategy', accentColor: 'magenta' },
  { id: 'four-in-row', title: 'Four in a Row 3D', description: '3D version of connect four', icon: Layers, category: 'strategy', accentColor: 'orange' },

  // ===== UNIQUE GAMES =====
  { id: 'neon-bounce', title: 'Neon Bounce', description: 'A unique ball bouncing puzzle - only here!', icon: Sparkles, category: 'unique', accentColor: 'cyan', route: '/games/neon-bounce', isNew: true },
  { id: 'color-rush', title: 'Color Rush', description: 'Match colors before time runs out', icon: Gem, category: 'unique', accentColor: 'magenta' },
  { id: 'gravity-grid', title: 'Gravity Grid', description: 'Rotate the board, use gravity!', icon: Wind, category: 'unique', accentColor: 'purple' },
  { id: 'wave-rider', title: 'Wave Rider', description: 'Surf the neon waves', icon: Waves, category: 'unique', accentColor: 'green' },
  { id: 'peak-climber', title: 'Peak Climber', description: 'Climb the neon mountain', icon: Mountain, category: 'unique', accentColor: 'orange' },
  { id: 'frost-maze', title: 'Frost Maze', description: 'Navigate the frozen labyrinth', icon: Snowflake, category: 'unique', accentColor: 'cyan' },
  { id: 'shadow-chase', title: 'Shadow Chase', description: 'Outsmart your shadow', icon: Moon, category: 'unique', accentColor: 'purple' },
  { id: 'bloom-garden', title: 'Bloom Garden', description: 'Grow and match flowers', icon: Flower2, category: 'unique', accentColor: 'magenta' },
  { id: 'forest-escape', title: 'Forest Escape', description: 'Find your way out', icon: TreePine, category: 'unique', accentColor: 'green' },
];
