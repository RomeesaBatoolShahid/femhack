import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/board");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <form 
        onSubmit={handleLogin}
        className="bg-white/30 backdrop-blur-md p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-full max-w-md border border-white/40"
      >
        <h2 className="text-4xl font-bold text-center text-purple-600 drop-shadow-md">
          Welcome Back 👋
        </h2>

        <input
          className="border border-purple-300 bg-white/60 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border border-purple-300 bg-white/60 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Login
        </button>

        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-500 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
