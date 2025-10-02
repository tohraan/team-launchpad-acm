import { useNavigate } from "react-router-dom";

const CookieTab = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200">
      <div className="text-center p-8 animate-scale-in">
        <div className="text-[200px] mb-8 animate-pulse">🍪</div>
        <h1 className="font-pixel text-3xl mb-8 text-amber-900">
          Please allow me,<br/>I'm just a cookie 🍪🙏
        </h1>
        <button
          onClick={() => navigate("/snake")}
          className="px-8 py-4 bg-amber-600 text-white font-pixel text-xl hover:bg-amber-700 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          Yes, I Accept Cookies
        </button>
      </div>
    </div>
  );
};

export default CookieTab;
