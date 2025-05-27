import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Container } from "react-bootstrap";
import MainPage from "./pages/MainPage.js";
import Question from "./pages/Question.js";
import Auth from "./pages/Auth.js";
import Register from "./pages/Register.js";
import Result from "./pages/Result.js";
import Navbar from "react-bootstrap/Navbar";
import { useState, createContext, useContext } from "react";
import {BrowserRouter, Routes, Route, Link, useNavigate, Navigate} from "react-router-dom";
import Button from "react-bootstrap/Button";

// Create auth context
export const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser"));

  const login = (userData) => {
    localStorage.setItem("accessToken", userData.accessToken);
    localStorage.setItem("refreshToken", userData.refreshToken);
    localStorage.setItem("currentUser", userData.username);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userName", userData.name);
    setCurrentUser(userData.username);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    // Clear chat messages
    sessionStorage.removeItem("chatMessages");
    // Clear any other session data
    sessionStorage.removeItem("currentQuestionData");
    sessionStorage.removeItem("currentQuestionKey");
    sessionStorage.removeItem("remainingQuestionCount");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      <BrowserRouter>
        <Container
          className="bg-light min-vh-100 p-0"
          fluid
        >
          <Navbar
            expand="lg"
            className="boxShadow"
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              height: "56px",
              marginBottom: 0,
              position: "relative",
              zIndex: 1000
            }}
          >
            <Container>
              <Navbar.Brand
                as={Link}
                to="/"
                style={{ color: "#333333" }}
              >
                AISADSA
              </Navbar.Brand>
              <div className="d-flex align-items-center">
                {currentUser && (
                  <Button
                    variant="light"
                    onClick={logout}
                    className="me-2"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </Container>
          </Navbar>

          <Routes>
            <Route path="/" element={currentUser == null ? <Navigate to="/auth" /> : <MainPage />} />
            <Route path="/question" element={currentUser == null ? <Navigate to="/auth" /> : <Question />} />
            <Route path="/result" element={currentUser == null ? <Navigate to="/auth" /> : <Result />} />
            <Route path="/auth" element={currentUser != null ? <Navigate to="/" /> : <Auth />} />
            <Route path="/register" element={currentUser != null ? <Navigate to="/" /> : <Register />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
