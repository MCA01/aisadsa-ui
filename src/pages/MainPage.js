import { Container, Row, Col } from "react-bootstrap";
import "./MainPage.css";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function MainPage() {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center">
      <Row className="w-100">
        <Col className="text-center">
          <h1 className="display-1">AISADSA</h1>
          <h3 className="display-5">
            AI Supported <i>"Data Architecture"</i> Design Session Assistant
          </h3>
        </Col>
      </Row>
      <Row className="w-100 my-4">
        <hr />
      </Row>
      <Row className="w-100">
        <Col className="text-center">
          <p className="display-6">Start an Architectural Design Session</p>
          <Link to="/question">
            <Button variant="secondary" size="md" className="px-4 py-2">
              Start
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default MainPage;
