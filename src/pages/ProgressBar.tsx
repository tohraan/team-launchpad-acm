import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Starting Chaos...");
  const [flickering, setFlickering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Evil stuttering logic
      if (currentProgress >= 80 && currentProgress < 90 && Math.random() > 0.7) {
        currentProgress -= Math.floor(Math.random() * 10) + 5;
        currentProgress = Math.max(0, currentProgress);
      }
      
      // Random pauses at specific points
      const pausePoints = [25, 47, 68, 90];
      if (pausePoints.includes(Math.floor(currentProgress)) && Math.random() > 0.5) {
        return;
      }
      
      // Slow increment 0-90%
      if (currentProgress < 90) {
        currentProgress += Math.random() * 2;
        setText(["Starting Chaos...", "Loading Madness...", "Initializing Insanity..."][Math.floor(Math.random() * 3)]);
      } 
      // Fast increment 90-99%
      else if (currentProgress < 99) {
        currentProgress += 5;
      }
      // Freeze at 99%
      else if (currentProgress >= 99) {
        currentProgress = 99;
        setFlickering(true);
        setText("Almost There...");
        
        // Complete after 2-3 seconds
        setTimeout(() => {
          navigate("/barebones");
        }, 2500);
        clearInterval(interval);
      }
      
      setProgress(Math.min(currentProgress, 99));
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c0c0c0]">
      <div className="w-full max-w-2xl p-8">
        <h1 className="font-pixel text-2xl mb-8 text-center text-black">
          {text}
        </h1>
        
        <div className="windows-border bg-white p-1">
          <div className="relative h-8 bg-[#f0f0f0]">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className={`font-retro text-xl mt-4 text-center ${flickering ? 'animate-flicker' : ''}`}>
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
