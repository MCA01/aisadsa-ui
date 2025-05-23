import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import './Result.css';

function Result() {
  const location = useLocation();
  const result = location.state?.result;
  const [isResizing, setIsResizing] = useState(false);
  const chatSidebarRef = useRef(null);
  const resizerRef = useRef(null);

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

  // If no result in state, redirect to home
  if (!result) {
    return <Navigate to="/" />;
  }

  return (
    <div className="result-page">
      <div className="main-content">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <div className="result-card">
                <h2 className="result-title">Your Architecture Analysis Result</h2>
                <div className="result-content">
                  {result}
                </div>
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

export default Result; 