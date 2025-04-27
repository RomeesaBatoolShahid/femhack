import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 text-center p-6">
      <h1 className="text-9xl font-extrabold text-pink-400 mb-8 animate-bounce">404</h1>
      <h2 className="text-3xl md:text-5xl font-bold text-purple-500 mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link 
        to="/" 
        className="bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-110 duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
