import { useEffect, useRef, useState } from "react";
import jobAppImage from "@/assets/job-application.png";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE;

interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [apple, setApple] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [appleCount, setAppleCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [showJobPopup, setShowJobPopup] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();

  // Chaotic score display
  useEffect(() => {
    const chaoticNumbers = [1, 23, 64586, 34, 999, 42, 1337, 69, 420, 8675309, 314159];
    if (appleCount > 0) {
      setDisplayCount(chaoticNumbers[appleCount % chaoticNumbers.length] || appleCount * 1000);
    }
  }, [appleCount]);

  // Timer effect
  useEffect(() => {
    if (!isPaused && !gameOver) {
      timerRef.current = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, gameOver]);

  // Show job application on 3rd apple
  useEffect(() => {
    if (appleCount === 3 && !showJobPopup) {
      setShowJobPopup(true);
      setIsPaused(true);
    }
  }, [appleCount, showJobPopup]);

  // Generate random apple position
  const generateApple = (): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  // Draw game on canvas
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Gameboy-style background (light greenish-grey)
    ctx.fillStyle = "#9bbc0f";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid lines
    ctx.strokeStyle = "#8bac0f";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake (dark green blocks)
    ctx.fillStyle = "#0f380f";
    snake.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      // Snake head slightly different
      if (index === 0) {
        ctx.fillStyle = "#306230";
        ctx.fillRect(
          segment.x * CELL_SIZE + 4,
          segment.y * CELL_SIZE + 4,
          CELL_SIZE - 8,
          CELL_SIZE - 8
        );
        ctx.fillStyle = "#0f380f";
      }
    });

    // Draw apple (red circle)
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(
      apple.x * CELL_SIZE + CELL_SIZE / 2,
      apple.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Apple highlight
    ctx.fillStyle = "#ff6666";
    ctx.beginPath();
    ctx.arc(
      apple.x * CELL_SIZE + CELL_SIZE / 2 - 3,
      apple.y * CELL_SIZE + CELL_SIZE / 2 - 3,
      3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  // Game loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check apple collision
        if (newHead.x === apple.x && newHead.y === apple.y) {
          setAppleCount((prev) => prev + 1);
          setApple(generateApple());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [direction, apple, isPaused, gameOver]);

  // Draw on every update
  useEffect(() => {
    draw();
  }, [snake, apple]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if ((key === "arrowup" || key === "w") && direction.y === 0) {
        setDirection({ x: 0, y: -1 });
      } else if ((key === "arrowdown" || key === "s") && direction.y === 0) {
        setDirection({ x: 0, y: 1 });
      } else if ((key === "arrowleft" || key === "a") && direction.x === 0) {
        setDirection({ x: -1, y: 0 });
      } else if ((key === "arrowright" || key === "d") && direction.x === 0) {
        setDirection({ x: 1, y: 0 });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-4xl text-toxic-green mb-4 animate-pulse">
          RETRO SNAKE GAME
        </h1>
        <div className="flex gap-8 justify-center font-retro text-xl">
          <div className="text-white">
            Apples: <span className="text-toxic-green font-bold">{displayCount}</span>
          </div>
          <div className="text-white">
            Time: <span className="text-portal-blue font-bold">{formatTime(gameTime)}</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-700 p-4 rounded-lg shadow-2xl border-4 border-gray-600">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-8 border-gray-800 rounded"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
            <div className="text-center">
              <h2 className="font-pixel text-3xl text-red-500 mb-4">GAME OVER</h2>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-toxic-green text-black font-pixel hover:bg-green-400 rounded"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {showJobPopup && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => {
                setShowJobPopup(false);
                setIsPaused(false);
                document.getElementById('click-me-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors z-10"
            >
              <span className="text-5xl font-bold cursor-pointer hover:scale-110 transition-transform inline-block">✖</span>
            </button>
            <img
              src={jobAppImage}
              alt="Job Application"
              className="w-full h-auto rounded-lg shadow-2xl border-4 border-toxic-green"
              onClick={() => {
                setShowJobPopup(false);
                setIsPaused(false);
                document.getElementById('click-me-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}

      <div id="click-me-section" className="mt-16 text-center">
        <a
          href="https://rickroll-lang.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-12 py-6 bg-portal-blue text-white font-pixel text-2xl rounded-lg shadow-lg hover:bg-blue-500 hover:scale-105 transition-all"
        >
          CLICK ME
        </a>
      </div>
    </div>
  );
};

export default SnakeGame;
