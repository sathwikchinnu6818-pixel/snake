import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const TRACKS = [
  {
    id: 1,
    title: "Neon Pulsar (AI Generated)",
    artist: "Synth Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-cyan-400",
  },
  {
    id: 2,
    title: "Cybernetic Groove (AI Generated)",
    artist: "Neural Net",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    color: "text-purple-400",
  },
  {
    id: 3,
    title: "Data Sequence (AI Generated)",
    artist: "Algorithm X",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    color: "text-pink-400",
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress(duration ? (current / duration) * 100 : 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <>
      {/* Side Menu: Playlist */}
      <div className="w-full lg:w-72 flex flex-col gap-4 z-10 shrink-0">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 px-2">Audio Stream</h3>
        <div className="flex flex-col gap-2">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id} 
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`group p-3 border rounded-lg flex gap-3 items-center cursor-pointer transition-opacity ${idx === currentTrackIndex ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${idx === currentTrackIndex ? 'bg-gradient-to-br from-emerald-500 to-cyan-600' : 'bg-fuchsia-600 grayscale group-hover:grayscale-0'}`}>
                {idx === currentTrackIndex && isPlaying ? (
                  <div className="w-1.5 h-4 bg-black/40 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-4 h-4 border-2 border-white/40 rounded-full"></div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{track.title.replace(' (AI Generated)', '')}</p>
                <p className={`text-[10px] uppercase tracking-wider ${idx === currentTrackIndex ? 'text-emerald-400' : 'text-white/40'}`}>
                  {idx === currentTrackIndex ? 'Active' : 'Standby'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* Bottom Music Controller */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-xl border-t border-white/5 px-4 lg:px-8 flex items-center gap-10 z-50 flex-wrap lg:flex-nowrap justify-between">
        <div className="flex items-center gap-4 w-64 shrink-0">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
             <Music className={`w-6 h-6 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{currentTrack.title.replace(' (AI Generated)', '')}</p>
            <p className="text-xs text-white/40 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 max-w-2xl mx-auto w-full order-last lg:order-none absolute lg:relative bottom-24 lg:bottom-auto left-0 lg:left-auto bg-black/90 lg:bg-transparent p-4 lg:p-0 border-t lg:border-none border-white/5">
          <div className="flex justify-center items-center gap-8">
            <button onClick={prevTrack} className="text-white/40 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
            </button>
            <button onClick={nextTrack} className="text-white/40 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/30 w-8 text-right">
              {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) : 0}:
              {audioRef.current ? String(Math.floor(audioRef.current.currentTime % 60)).padStart(2, '0') : '00'}
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-white/30 w-8">
              {audioRef.current && !isNaN(audioRef.current.duration) ? Math.floor(audioRef.current.duration / 60) : 0}:
              {audioRef.current && !isNaN(audioRef.current.duration) ? String(Math.floor(audioRef.current.duration % 60)).padStart(2, '0') : '00'}
            </span>
          </div>
        </div>

        <div className="w-64 flex justify-end items-center gap-4 hidden md:flex shrink-0">
          <Volume2 className="w-4 h-4 text-white/40" />
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[80%] bg-white/40"></div>
          </div>
        </div>
      </div>
    </>
  );
}
