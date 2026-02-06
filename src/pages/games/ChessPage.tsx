import ComingSoonPage from '@/components/ComingSoonPage';
import { Crown } from 'lucide-react';

const ChessPage = () => (
  <ComingSoonPage
    title="Chess"
    description="The king of all strategy games. Challenge friends or AI in this timeless classic. Full piece movement, castling, en passant, and more!"
    icon={Crown}
    accentColor="purple"
  />
);

export default ChessPage;
