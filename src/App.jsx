import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookList from "./components/BookList";
import UserList from "./components/UserList"; // Ensure this is imported
import Login from "./components/Login";

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (
    <Router>
      <div>
        {token ? (
          <>
            <Navbar handleLogout={handleLogout} /> {/* Pass handleLogout here */}
            <Routes>
              <Route path="/" element={<BookList handleLogout={handleLogout} />} />
              <Route path="/users" element={<UserList handleLogout={handleLogout} />} />
            </Routes>
          </>
        ) : (
          <Login setToken={setToken} />
        )}
      </div>
    </Router>
  );
};

export default App;
