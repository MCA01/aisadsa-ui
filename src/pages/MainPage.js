import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Using token:', token);

      // Get the first question
      const response = await fetch('/api/v1/questions/nonRelationalUsage', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error details:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`Failed to fetch initial question: ${response.status} - ${errorText}`);
      }

      const questionData = await response.json();
      console.log('Received first question:', questionData);

      // Store the first question data and its key
      sessionStorage.setItem('currentQuestionData', JSON.stringify(questionData));
      sessionStorage.setItem('currentQuestionKey', 'nonRelationalUsage');
      sessionStorage.setItem('remainingQuestionCount', '13'); // Set initial count since we're starting
      navigate('/question');
    } catch (error) {
      console.error('Error starting session:', error);
      setError(`Failed to start session: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Background decorations */}
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>

      <div className="main-content">
        <h1 className="brand-title">AISADSA</h1>
        <h2 className="brand-subtitle">
          AI Supported <i>Data Architecture</i> Design Session Assistant
        </h2>

        <div className="divider"></div>

        <div className="start-section">
          <p className="start-text">Start an Architectural Design Session</p>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Button 
            variant="primary" 
            className="start-button"
            onClick={handleGetStarted}
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Get Started'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
