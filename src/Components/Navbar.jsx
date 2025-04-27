import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition">
        Trello Clone 🚀
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 font-semibold text-gray-700">
        <Link to="/" className="hover:text-purple-500 transition">Home</Link>
        <Link to="/board" className="hover:text-purple-500 transition">Board</Link>
        <Link to="/profile" className="hover:text-purple-500 transition">Profile</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
