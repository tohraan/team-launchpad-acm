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
  const [triggerAppleCount] = useState(() => Math.floor(Math.random() * 6) + 1); // Random 1-6
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

  // Show job application on random apple count
  useEffect(() => {
    if (appleCount === triggerAppleCount && !showJobPopup) {
      setShowJobPopup(true);
      setIsPaused(true);
    }
  }, [appleCount, showJobPopup, triggerAppleCount]);

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
      if (index === 0) {
        // Snake head - more distinct with eyes
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
        // Eyes based on direction
        ctx.fillStyle = "#306230";
        if (direction.x === 1) { // Right
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 6, 3, 3);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 11, 3, 3);
        } else if (direction.x === -1) { // Left
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 6, 3, 3);
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 11, 3, 3);
        } else if (direction.y === -1) { // Up
          ctx.fillRect(segment.x * CELL_SIZE + 6, segment.y * CELL_SIZE + 5, 3, 3);
          ctx.fillRect(segment.x * CELL_SIZE + 11, segment.y * CELL_SIZE + 5, 3, 3);
        } else { // Down
          ctx.fillRect(segment.x * CELL_SIZE + 6, segment.y * CELL_SIZE + 12, 3, 3);
          ctx.fillRect(segment.x * CELL_SIZE + 11, segment.y * CELL_SIZE + 12, 3, 3);
        }
        ctx.fillStyle = "#0f380f";
      } else {
        // Body segments
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      }
    });

    // Draw pixel-style apple
    const appleX = apple.x * CELL_SIZE;
    const appleY = apple.y * CELL_SIZE;
    
    // Apple body (red)
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(appleX + 6, appleY + 8, 8, 8);
    ctx.fillRect(appleX + 4, appleY + 10, 12, 4);
    ctx.fillRect(appleX + 3, appleY + 11, 14, 2);
    
    // Apple highlight
    ctx.fillStyle = "#ff6666";
    ctx.fillRect(appleX + 7, appleY + 9, 2, 2);
    
    // Stem (brown)
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(appleX + 10, appleY + 5, 2, 4);
    
    // Leaf (green)
    ctx.fillStyle = "#228B22";
    ctx.fillRect(appleX + 11, appleY + 4, 3, 2);
    ctx.fillRect(appleX + 12, appleY + 3, 2, 2);
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

        // Wall wrapping mechanic (Gameboy style)
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;

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

  const handleMobileControl = (dir: Position) => {
    if (dir.x !== 0 && direction.x === 0) {
      setDirection(dir);
    } else if (dir.y !== 0 && direction.y === 0) {
      setDirection(dir);
    }
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
          className="border-8 border-gray-800 rounded mb-4"
        />
        
        {/* Mobile Gameboy-style controls */}
        <div className="flex flex-col items-center gap-2 md:hidden">
          <button
            onClick={() => handleMobileControl({ x: 0, y: -1 })}
            className="w-16 h-16 bg-gray-800 border-4 border-gray-600 rounded text-toxic-green font-pixel text-2xl hover:bg-gray-700 active:bg-gray-900"
          >
            ↑
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleMobileControl({ x: -1, y: 0 })}
              className="w-16 h-16 bg-gray-800 border-4 border-gray-600 rounded text-toxic-green font-pixel text-2xl hover:bg-gray-700 active:bg-gray-900"
            >
              ←
            </button>
            <button
              onClick={() => handleMobileControl({ x: 0, y: 1 })}
              className="w-16 h-16 bg-gray-800 border-4 border-gray-600 rounded text-toxic-green font-pixel text-2xl hover:bg-gray-700 active:bg-gray-900"
            >
              ↓
            </button>
            <button
              onClick={() => handleMobileControl({ x: 1, y: 0 })}
              className="w-16 h-16 bg-gray-800 border-4 border-gray-600 rounded text-toxic-green font-pixel text-2xl hover:bg-gray-700 active:bg-gray-900"
            >
              →
            </button>
          </div>
        </div>

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
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={() => {
            setShowJobPopup(false);
            setIsPaused(false);
            document.getElementById('click-me-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={jobAppImage}
              alt="Job Application"
              className="w-full h-auto rounded-lg shadow-2xl border-4 border-toxic-green"
            />
            <button
              onClick={() => {
                setShowJobPopup(false);
                setIsPaused(false);
                document.getElementById('click-me-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="absolute top-4 right-4 w-12 h-12 md:w-14 md:h-14 bg-toxic-green hover:bg-green-400 border-4 border-gray-900 rounded flex items-center justify-center text-gray-900 font-pixel text-2xl md:text-3xl shadow-2xl hover:scale-110 transition-all cursor-pointer"
              style={{ boxShadow: '0 0 20px rgba(155, 188, 15, 0.8)' }}
            >
              ✖
            </button>
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
