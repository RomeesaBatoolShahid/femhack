import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import BoardPage from './Pages/BoardPage';

import NotFound from "./Pages/NotFound";
import ProfilePage from "./Pages/ProfilePage";
import ProtectedRoute from "./Components/ProtectedRoute"; // <<< New import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* PROTECTED Board page */}
        <Route 
          path="/board" 
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;