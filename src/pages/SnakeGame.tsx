import { useEffect, useRef, useState } from "react";
import jobAppImage from "@/assets/job-application.png";

interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [showJobApp, setShowJobApp] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Position>({ x: 1, y: 0 });
  const appleRef = useRef<Position>({ x: 15, y: 15 });
  const nextDirectionRef = useRef<Position>({ x: 1, y: 0 });

  const gridSize = 20;
  const tileSize = 20;

  // Chaotic score display
  useEffect(() => {
    const chaoticScores = [1, 23, 64586, 34, 999, 42, 1337, 69, 420, 8675309];
    if (score > 0) {
      setDisplayScore(chaoticScores[score % chaoticScores.length] || score * 100);
    }
  }, [score]);

  // Show job application on 3rd apple
  useEffect(() => {
    if (score === 3 && !showJobApp) {
      setShowJobApp(true);
      setGamePaused(true);
    }
  }, [score, showJobApp]);

  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = setInterval(() => {
      // Update direction
      directionRef.current = nextDirectionRef.current;
      
      // Move snake
      const head = { ...snakeRef.current[0] };
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // Wrap around edges
      if (head.x < 0) head.x = gridSize - 1;
      if (head.x >= gridSize) head.x = 0;
      if (head.y < 0) head.y = gridSize - 1;
      if (head.y >= gridSize) head.y = 0;

      // Check self collision
      if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        snakeRef.current = [{ x: 10, y: 10 }];
        setScore(0);
        return;
      }

      snakeRef.current = [head, ...snakeRef.current];

      // Check apple collision
      if (head.x === appleRef.current.x && head.y === appleRef.current.y) {
        setScore(prev => prev + 1);
        appleRef.current = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };
      } else {
        snakeRef.current.pop();
      }

      // Draw
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      ctx.fillStyle = "#44ff44";
      snakeRef.current.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 2, tileSize - 2);
      });

      // Draw apple
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(appleRef.current.x * tileSize, appleRef.current.y * tileSize, tileSize - 2, tileSize - 2);
    }, 150);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gamePaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        setGameStarted(true);
      }

      const key = e.key.toLowerCase();
      const dir = directionRef.current;

      if ((key === "arrowup" || key === "w") && dir.y === 0) {
        nextDirectionRef.current = { x: 0, y: -1 };
      } else if ((key === "arrowdown" || key === "s") && dir.y === 0) {
        nextDirectionRef.current = { x: 0, y: 1 };
      } else if ((key === "arrowleft" || key === "a") && dir.x === 0) {
        nextDirectionRef.current = { x: -1, y: 0 };
      } else if ((key === "arrowright" || key === "d") && dir.x === 0) {
        nextDirectionRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted]);

  const closeJobApp = () => {
    setShowJobApp(false);
    setGamePaused(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="mb-4 font-pixel text-2xl text-green-400 animate-glitch">
        APPLES: {displayScore}
      </div>
      
      <canvas
        ref={canvasRef}
        width={gridSize * tileSize}
        height={gridSize * tileSize}
        className="border-4 border-green-400"
      />
      
      {!gameStarted && (
        <div className="mt-4 font-pixel text-sm text-green-400">
          Press Arrow Keys or WASD to Start
        </div>
      )}

      <a
        href="https://rickroll-lang.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-pixel text-xl hover:scale-110 transition-transform rounded-lg shadow-lg"
      >
        Click Me
      </a>

      {showJobApp && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8"
          onClick={closeJobApp}
        >
          <div className="relative max-w-4xl w-full animate-scale-in">
            <button
              onClick={closeJobApp}
              className="absolute top-4 right-4 text-white font-pixel text-2xl hover:text-red-500 z-10"
            >
              ✖
            </button>
            <img 
              src={jobAppImage} 
              alt="Job Application" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
