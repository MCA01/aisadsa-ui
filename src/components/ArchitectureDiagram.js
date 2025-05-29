import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

function ArchitectureDiagram({ diagramDefinition }) {
  const diagramRef = useRef(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'arial',
      logLevel: 'debug'
    });

    // Render the diagram
    if (diagramDefinition && diagramRef.current) {
      // Clean up the diagram definition
      const cleanDiagram = diagramDefinition
        .replace(/mermaid version \d+\.\d+\.\d+/i, '') // Remove version info
        .replace(/```mermaid\n?/i, '') // Remove opening markdown code block
        .replace(/```\n?$/, '') // Remove closing markdown code block
        .trim(); // Remove extra whitespace

      console.log('Cleaned diagram definition:', cleanDiagram);
      
      try {
        // First validate the diagram syntax
        mermaid.parse(cleanDiagram).then(() => {
          // If parsing succeeds, render the diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          mermaid.render(id, cleanDiagram).then(({ svg }) => {
            if (diagramRef.current) {
              diagramRef.current.innerHTML = svg;
            }
          }).catch(error => {
            console.error('Error rendering mermaid diagram:', error);
            if (diagramRef.current) {
              diagramRef.current.innerHTML = `Error rendering diagram: ${error.message}`;
            }
          });
        }).catch(error => {
          console.error('Error parsing mermaid diagram:', error);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = `Invalid diagram syntax: ${error.message}`;
          }
        });
      } catch (error) {
        console.error('Unexpected error:', error);
        if (diagramRef.current) {
          diagramRef.current.innerHTML = `Unexpected error: ${error.message}`;
        }
      }
    }
  }, [diagramDefinition]);

  return (
    <div className="architecture-diagram">
      <div ref={diagramRef} className="mermaid-container">
        {!diagramDefinition && 'No diagram definition provided'}
      </div>
    </div>
  );
}

export default ArchitectureDiagram; 