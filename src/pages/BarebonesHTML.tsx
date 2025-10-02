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
    let popupCount = 0;
    
    const spawnInterval = setInterval(() => {
      if (popupCount >= 12) {
        setShowFinalPopup(true);
        clearInterval(spawnInterval);
        return;
      }

      const newPopup: Popup = {
        id: Date.now() + Math.random(),
        text: popupTexts[Math.floor(Math.random() * popupTexts.length)],
        x: Math.random() * (window.innerWidth - 400),
        y: Math.random() * (window.innerHeight - 250),
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setPopups(prev => [...prev, newPopup]);
      popupCount++;

      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== newPopup.id));
      }, 3000);
    }, 200 + Math.random() * 100);

    return () => clearInterval(spawnInterval);
  }, []);

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
          className="fixed border-4 border-black p-6 shadow-2xl z-10 font-pixel text-sm min-w-[350px] animate-scale-in"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y}px`,
            backgroundColor: popup.color,
            opacity: 0.95,
          }}
        >
          <div className="flex justify-between items-start gap-4">
            <p className="text-base font-bold">{popup.text}</p>
            <button
              onClick={() => dismissPopup(popup.id)}
              className="text-red-600 font-bold hover:text-red-800 text-lg"
            >
              ✖
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600">Yes</button>
            <button className="px-4 py-2 bg-gray-500 text-white text-sm font-bold hover:bg-gray-600">No</button>
          </div>
        </div>
      ))}

      {showFinalPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-12 rounded-lg border-8 border-yellow-400 max-w-xl w-full mx-4 animate-scale-in shadow-2xl">
            <h2 className="font-pixel text-3xl mb-8 text-center text-black animate-pulse">FINAL COOKIE CONSENT</h2>
            <p className="font-retro mb-8 text-center text-xl text-black">
              We need your cookies to survive. Please? 🍪
            </p>
            <div className="flex gap-6 justify-center">
              <button
                className="px-8 py-4 bg-green-500 text-white font-pixel text-lg hover:bg-green-600 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                Yes (Does Nothing)
              </button>
              <button
                onClick={() => navigate("/cookie")}
                className="px-8 py-4 bg-red-500 text-white font-pixel text-lg hover:bg-red-600 rounded-lg shadow-lg hover:scale-105 transition-transform"
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
