import { Container, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import "./Question.css";

function Question() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Handle change to set the selected answer
  const handleChange = (event) => {
    setSelectedAnswer(event.target.id); // Update selected answer based on the radio button clicked
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center">
      <Row className="w-100">
        <Col className="text-center">
          <div className="display-6 mt-4 mb-4">
            Question text hypium dolores?
          </div>
          <Form>
            <div key="answers" className="mb-3">
              <Form.Check
                type="radio"
                name="answer"
                id="answer1"
                label="Answer 1"
                checked={selectedAnswer === "answer1"}
                onChange={handleChange}
                className="answer-option"
              />
              <Form.Check
                type="radio"
                name="answer"
                id="answer2"
                label="Answer 2"
                checked={selectedAnswer === "answer2"}
                onChange={handleChange}
                className="answer-option"
              />
              <Form.Check
                type="radio"
                name="answer"
                id="answer3"
                label="Answer 3"
                checked={selectedAnswer === "answer3"}
                onChange={handleChange}
                className="answer-option"
              />
              <Form.Check
                type="radio"
                name="answer"
                id="answer4"
                label="Answer 4"
                checked={selectedAnswer === "answer4"}
                onChange={handleChange}
                className="answer-option"
              />
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Question;
