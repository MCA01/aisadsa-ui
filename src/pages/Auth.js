import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import "./Auth.css";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log('Sending login request with:', { username: username.trim() }); // Debug log

      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password 
        })
      });

      const responseData = await res.text();
      console.log('Raw login response:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: responseData
      });

      if (!res.ok) {
        // Try to parse the error message as JSON
        try {
          const errorJson = JSON.parse(responseData);
          console.log('Parsed error response:', errorJson);
          throw new Error(errorJson.message || errorJson.error || "Login failed");
        } catch (e) {
          // If parsing fails, use the raw text
          console.log('Failed to parse error response as JSON, using raw text');
          throw new Error(responseData || "Login failed");
        }
      }

      // Try to parse the success response
      try {
        const data = JSON.parse(responseData);
        console.log('Parsed success response:', { ...data, accessToken: '***' });
        if (!data.accessToken || !data.username) {
          throw new Error("Invalid response from server");
        }
        login(data);
      } catch (e) {
        console.log('Failed to parse success response:', e);
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        stack: err.stack
      });
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>
        
        <Form className="auth-form" onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </Form.Group>

          {error && <div className="error-message">{error}</div>}

          <Button
            variant="primary"
            type="submit"
            className={isLoading ? 'loading' : ''}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;

