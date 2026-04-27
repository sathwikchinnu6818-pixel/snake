/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from "./components/MusicPlayer";
import { SnakeGame } from "./components/SnakeGame";

export default function App() {
  return (
    <div className="h-screen w-screen bg-[#050507] text-white font-sans flex flex-col overflow-hidden select-none">
      
      {/* Top Navigation / Status Bar */}
      <div className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0 py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.6)] flex items-center justify-center font-bold text-black italic text-xl">S</div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-emerald-400">Synth-Snake <span className="hidden md:inline-block text-white/30 font-light italic ml-2 text-sm uppercase tracking-[0.2em]">v2.04</span></h1>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-0">Systems Ready</p>
          <p className="text-xs font-mono text-white/40">Press Start</p>
        </div>
      </div>

      {/* Main Viewport */}
      {/* Note: pb-28 accounts for the fixed 24 (96px) bottom music controller */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6 relative overflow-y-auto lg:overflow-hidden pb-48 lg:pb-28">
        
        <MusicPlayer />
        
        {/* Game Window container */}
        <div className="flex-1 flex flex-col h-[500px] lg:h-full overflow-hidden shrink-0 lg:shrink min-h-0">
          <SnakeGame />
        </div>

      </div>

    </div>
  );
}
