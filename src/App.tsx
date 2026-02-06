import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GameHub from "./pages/GameHub";
import PlayerVsPlayer from "./pages/PlayerVsPlayer";
import PlayerVsAI from "./pages/PlayerVsAI";
import OnlineMultiplayer from "./pages/OnlineMultiplayer";
import SettingsPage from "./pages/SettingsPage";
import ChessPage from "./pages/games/ChessPage";
import LudoPage from "./pages/games/LudoPage";
import SnakeLaddersPage from "./pages/games/SnakeLaddersPage";
import CarromPage from "./pages/games/CarromPage";
import NeonBouncePage from "./pages/games/NeonBouncePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<GameHub />} />
          <Route path="/pvp" element={<PlayerVsPlayer />} />
          <Route path="/ai" element={<PlayerVsAI />} />
          <Route path="/online" element={<OnlineMultiplayer />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/games/chess" element={<ChessPage />} />
          <Route path="/games/ludo" element={<LudoPage />} />
          <Route path="/games/snake-ladders" element={<SnakeLaddersPage />} />
          <Route path="/games/carrom" element={<CarromPage />} />
          <Route path="/games/neon-bounce" element={<NeonBouncePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
