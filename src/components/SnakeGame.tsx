import { useEffect, useRef, useState, useCallback } from "react";
import { Play } from "lucide-react";

type Point = { x: number; y: number };
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const SPEED = 120; // ms per tick

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);

  const randomFoodPos = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setFood(randomFoodPos(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying) {
        if (e.key === " " && gameOver) startGame();
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, randomFoodPos]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newDirection = directionRef.current;
        const newHead = {
          x: head.x + newDirection.x,
          y: head.y + newDirection.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          setHighScore((prev) => Math.max(prev, score));
          return prevSnake;
        }

        // Self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          setIsPlaying(false);
          setHighScore((prev) => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(randomFoodPos(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, food, score, randomFoodPos]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Food (Neon Fuchsia)
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#d946ef"; // fuchsia-500
    ctx.fillStyle = "#d946ef"; // fuchsia-500
    
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake (Neon Emerald)
    snake.forEach((segment, index) => {
      ctx.shadowBlur = index === 0 ? 10 : 0;
      ctx.shadowColor = "#34d399"; // emerald-400
      ctx.fillStyle = index === 0 ? "#10b981" : "rgba(16, 185, 129, 0.8)"; // emerald-500/80
      
      const padding = index === 0 ? 0 : 2; // Head is slightly larger
      const innerSize = CELL_SIZE - padding * 2;
      
      ctx.fillRect(
        segment.x * CELL_SIZE + padding,
        segment.y * CELL_SIZE + padding,
        innerSize,
        innerSize
      );
    });

    // Reset shadow for text
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex-1 bg-[#0a0a0d] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-6 h-full w-full shadow-none w-full max-w-full">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(16,185,129,0.3) 1px, transparent 0)", backgroundSize: "24px 24px" }} />

      {/* UI HUD Labels */}
      <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none z-10">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Engine Live</span>
      </div>
      <div className="absolute bottom-6 right-6 text-right pointer-events-none z-10">
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Rendering Grid</p>
        <p className="text-xs font-mono text-white/50">{GRID_SIZE}x{GRID_SIZE} // 60fps</p>
      </div>

      <div className="w-full flex justify-between items-center mb-6 z-10 max-w-[400px]">
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0">Current Score</p>
          <p className="text-3xl font-mono leading-none font-bold text-emerald-400 tabular-nums">
            {score.toString().padStart(4, "0")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0">High Score</p>
          <p className="text-xl font-mono leading-none font-bold text-fuchsia-500 tabular-nums">
            {highScore.toString().padStart(4, "0")}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden z-10 w-full max-w-[400px] flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block w-full h-auto bg-transparent border border-white/5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          style={{ aspectRatio: "1/1" }}
        />
        
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 rounded-xl transition-opacity">
            {gameOver && (
              <h2 className="text-4xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] mb-2">
                SYSTEM FAILURE
              </h2>
            )}
            
            <button
              onClick={startGame}
              className="mt-6 flex items-center justify-center gap-2 group relative px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{gameOver ? "REBOOT" : "INITIALIZE"}</span>
            </button>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-6 opacity-70">
              Input Map: W A S D / Arrows
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
