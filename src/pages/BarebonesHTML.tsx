import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Popup {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

const BarebonesHTML = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const navigate = useNavigate();

  const popupTexts = [
    "Allow Cache?",
    "Allow Multiverse Travel?",
    "Allow RAM?",
    "Allow Infinite Cookies?",
    "Allow Air?",
    "Allow Existential Dread?",
    "Allow Portal Gun?",
    "Allow Schwifty Mode?",
    "Allow Pickle Rick?",
    "Allow Dimension C-137?",
    "Allow Plumbus?",
    "Allow Meeseeks Box?",
  ];

  const colors = [
    "#ffb3ba", "#bae1ff", "#ffffba", "#baffc9", "#ffdfba",
    "#e0bbe4", "#ffd1dc", "#c7ceea", "#ffdfd3", "#d4f1f4"
  ];

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (popups.length >= 16) {
        setShowFinalPopup(true);
        clearInterval(spawnInterval);
        return;
      }

      const newPopup: Popup = {
        id: Date.now() + Math.random(),
        text: popupTexts[Math.floor(Math.random() * popupTexts.length)],
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 200),
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setPopups(prev => [...prev, newPopup]);

      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== newPopup.id));
      }, 2000 + Math.random() * 1000);
    }, 200 + Math.random() * 100);

    return () => clearInterval(spawnInterval);
  }, [popups.length]);

  const dismissPopup = (id: number) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-white p-8 relative overflow-hidden">
      <h1>Welcome to the Hackathon</h1>
      <p>This is a simple HTML page with absolutely no styling whatsoever.</p>
      <ul>
        <li>Feature 1: Chaos</li>
        <li>Feature 2: More Chaos</li>
        <li>Feature 3: Even More Chaos</li>
      </ul>
      <p>Please enjoy your stay in this dimension.</p>

      {popups.map(popup => (
        <div
          key={popup.id}
          className="fixed border-2 border-black p-4 shadow-lg z-10 font-pixel text-xs"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y}px`,
            backgroundColor: popup.color,
            opacity: 0.95,
          }}
        >
          <div className="flex justify-between items-start gap-4">
            <p>{popup.text}</p>
            <button
              onClick={() => dismissPopup(popup.id)}
              className="text-red-600 font-bold hover:text-red-800"
            >
              ✖
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white text-xs">Yes</button>
            <button className="px-3 py-1 bg-gray-500 text-white text-xs">No</button>
          </div>
        </div>
      ))}

      {showFinalPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-8 rounded-lg border-4 border-yellow-400 max-w-md animate-scale-in">
            <h2 className="font-pixel text-xl mb-6 text-center">FINAL COOKIE CONSENT</h2>
            <p className="font-retro mb-6 text-center text-lg">
              We need your cookies to survive. Please?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-3 bg-green-500 text-white font-pixel text-sm hover:bg-green-600 rounded"
              >
                Yes (Does Nothing)
              </button>
              <button
                onClick={() => navigate("/cookie")}
                className="px-6 py-3 bg-red-500 text-white font-pixel text-sm hover:bg-red-600 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarebonesHTML;
