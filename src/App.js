import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Container } from "react-bootstrap";
import MainPage from "./pages/MainPage.js";
import Question from "./pages/Question.js";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <BrowserRouter>
      <Container
        className={
          darkMode
            ? "bg-dark text-light min-vh-100 min-vw-100"
            : "bg-light text-dark min-vh-100 min-vw-100"
        }
      >
        <Navbar
          expand="lg"
          className="boxShadow mb-4"
          style={{
            boxShadow: darkMode
              ? "0 .5rem 1rem rgba(255, 255, 255, 0.2)"
              : "0 .5rem 1rem rgba(0, 0, 0, 0.15)",
          }}
        >
          <Container>
            <Navbar.Brand
              as={Link}
              to="/"
              style={{ color: darkMode ? "#FFFFFF" : "#333333" }}
            >
              AISADSA
            </Navbar.Brand>
            <Button
              variant={darkMode ? "dark" : "light"}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <FontAwesomeIcon icon={faSun} />
              ) : (
                <FontAwesomeIcon icon={faMoon} />
              )}
            </Button>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/question" element={<Question />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
