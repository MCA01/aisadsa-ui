import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Question.css";
import ChatInterface from "../components/ChatInterface";

function Question() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingQuestions, setRemainingQuestions] = useState(null);
  const chatSidebarRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    // Get the stored question data
    const storedQuestionData = sessionStorage.getItem('currentQuestionData');
    const storedRemainingCount = sessionStorage.getItem('remainingQuestionCount');

    if (!storedQuestionData) {
      // If there's no question data, redirect back to main page
      navigate('/');
      return;
    }

    try {
      // Parse and display the stored question
      const questionData = JSON.parse(storedQuestionData);
      setQuestion(questionData.description);
      const options = [questionData.option1, questionData.option2, questionData.option3, questionData.option4]
        .filter(option => option !== "");
      setAnswers(options);
      // Initialize remaining questions count
      const remainingCount = parseInt(storedRemainingCount || '13');
      setRemainingQuestions(remainingCount);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing question data:', error);
      setError('Invalid question data');
      setIsLoading(false);
    }
  }, [navigate]);

  const fetchQuestion = async (questionKey) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/questions/${questionKey}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      const data = await response.json();
      console.log('Question data received:', data);
      
      if (!data.description) {
        throw new Error('Invalid question format received from server');
      }

      setQuestion(data.description);
      const options = [data.option1, data.option2, data.option3, data.option4]
        .filter(option => option !== "");
      setAnswers(options);
      sessionStorage.setItem('currentQuestionData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Failed to load question. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFinal = async () => {
    try {
      const response = await fetch('/api/v1/user-data/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to submit final answers');
      }

      const result = await response.text();
      // Navigate to result page with the analysis result
      navigate('/result', { state: { result } });
    } catch (error) {
      console.error('Error submitting final answers:', error);
      setError('Failed to submit answers. Please try again.');
    }
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      setError('Please select an answer before proceeding.');
      return;
    }

    try {
      // Get the selected answer's text
      const selectedAnswerText = answers[parseInt(selectedAnswer.replace('answer', '')) - 1];
      console.log('Selected answer:', selectedAnswerText);

      // Get current question key from session storage
      const currentQuestionKey = sessionStorage.getItem('currentQuestionKey');
      if (!currentQuestionKey) {
        throw new Error('Question key not found');
      }

      // Send the answer and get next question key
      const createResponse = await fetch('/api/v1/user-data/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionKey: currentQuestionKey,
          userData: selectedAnswerText
        })
      });

      if (!createResponse.ok) {
        throw new Error('Failed to submit answer');
      }

      // Get the next question info
      const nextData = await createResponse.json();
      console.log('Next question info:', nextData);

      // Update remaining questions count
      setRemainingQuestions(nextData.remainingQuestionCount);

      // If this was the last question (next count will be 0), don't fetch next question
      if (nextData.remainingQuestionCount === 0) {
        setError(null);
        setSelectedAnswer(null);
        return;
      }

      // Store the new question key and fetch next question
      sessionStorage.setItem('currentQuestionKey', nextData.nextQuestionKey);
      await fetchQuestion(nextData.nextQuestionKey);
      setSelectedAnswer(null);
      setError(null);
    } catch (error) {
      console.error('Error in question flow:', error);
      setError('Failed to process answer. Please try again.');
    }
  };

  useEffect(() => {
    const handleMouseDown = (e) => {
      setIsResizing(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      resizerRef.current?.classList.add('active');
    };

    const handleMouseMove = (e) => {
      if (isResizing && chatSidebarRef.current) {
        const containerWidth = chatSidebarRef.current.parentElement.offsetWidth;
        const newWidth = containerWidth - e.clientX;
        const constrainedWidth = Math.min(Math.max(newWidth, 300), 800);
        chatSidebarRef.current.style.width = `${constrainedWidth}px`;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      resizerRef.current?.classList.remove('active');
    };

    const resizer = resizerRef.current;
    if (resizer) {
      resizer.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (resizer) {
        resizer.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (isLoading) {
    return (
      <div className="question-page">
        <div className="main-content">
          <Container>
            <Row className="justify-content-center">
              <Col md={10} lg={8}>
                <div>Loading question...</div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="question-page">
        <div className="main-content">
          <Container>
            <Row className="justify-content-center">
              <Col md={10} lg={8}>
                <div className="error-message">{error}</div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="question-page">
      <div className="main-content">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <div className="display-6 mb-4">
                {question}
              </div>
              <div className="answers-container">
                {answers.map((answer, index) => (
                  <div
                    key={`answer${index + 1}`}
                    className={`answer-option ${selectedAnswer === `answer${index + 1}` ? 'selected' : ''}`}
                    onClick={() => setSelectedAnswer(`answer${index + 1}`)}
                  >
                    <span className="answer-text">{answer}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end mt-4">
                {remainingQuestions !== null && (
                  <Button 
                    variant="primary" 
                    onClick={remainingQuestions === 0 ? handleSubmitFinal : handleNext}
                    disabled={!selectedAnswer}
                  >
                    {remainingQuestions === 0 ? 'Submit' : 'Next Question'}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="chat-sidebar" ref={chatSidebarRef}>
        <div className="chat-sidebar-resizer" ref={resizerRef}></div>
        <ChatInterface />
      </div>
    </div>
  );
}

export default Question;
