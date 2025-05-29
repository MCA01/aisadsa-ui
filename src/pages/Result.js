import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ChatInterface from '../components/ChatInterface';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import './Result.css';

function Result() {
  const location = useLocation();
  const result = location.state?.result;
  const [isResizing, setIsResizing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [architectureDiagram, setArchitectureDiagram] = useState(null);
  const chatSidebarRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    const fetchAiResult = async () => {
      try {
        const response = await fetch('/api/v1/ai/document-generation', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI analysis');
        }

        const data = await response.text();
        setAiResult(data);

        // Fetch architecture diagram
        const diagramResponse = await fetch('/api/v1/ai/diagram-generation', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Accept': 'application/json'
          }
        });

        if (diagramResponse.ok) {
          const diagramData = await diagramResponse.text();
          console.log('Received diagram data:', diagramData);
          setArchitectureDiagram(diagramData);
        } else {
          console.error('Failed to fetch diagram:', diagramResponse.status, diagramResponse.statusText);
          const errorText = await diagramResponse.text();
          console.error('Error details:', errorText);
        }
      } catch (error) {
        console.error('Error fetching AI analysis:', error);
        setAiResult('Failed to generate AI analysis. Please try again later.');
      }
    };

    if (result) {
      fetchAiResult();
    }
  }, [result]);

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
            <Col xs={12}>
              {/* Business Rule Engine Result */}
              <div className="result-section">
                <h3 className="section-title">Result</h3>
                <div className="result-content markdown-content">
                  {result ? (
                    <ReactMarkdown>{result}</ReactMarkdown>
                  ) : (
                    'No result available'
                  )}
                </div>
              </div>

              {/* AI Generated Result */}
              <div className="result-section">
                <h3 className="section-title">AI Generated Explanation</h3>
                <div className="result-content markdown-content">
                  {aiResult ? (
                    <ReactMarkdown>{aiResult}</ReactMarkdown>
                  ) : (
                    'Generating AI analysis...'
                  )}
                </div>
              </div>

              {/* Architecture Diagram */}
              <div className="result-section">
                <h3 className="section-title">Architecture Diagram</h3>
                <div className="result-content">
                  {architectureDiagram ? (
                    <ArchitectureDiagram diagramDefinition={architectureDiagram} />
                  ) : (
                    'Generating architecture diagram...'
                  )}
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