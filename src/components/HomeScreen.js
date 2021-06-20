import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import '../home.css';
import logo from '../images/Fresh-Edit-Logo.png'

const HomeScreen = ({ docId, setDocId }) => {
  const [show, setShow] = useState(false);
  const inputHandler = (e) => {
    setDocId(e.target.value);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="parent-container">
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand>Fresh Edit</Navbar.Brand>
        <Button variant="primary" onClick={handleShow} className="about-btn">
          About
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>About</Modal.Title>
          </Modal.Header>
          <Modal.Body>Fresh Edit is an Online Collaborative Text Editor which is based on React JS, Node JS, Sockets and MongoDB</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Navbar>
      <div className="home-container">
        <Card style={{ width: '40rem' }} className="home-card">
          <Card.Img variant="top"  src={logo} style={{ height: '100%', width: "10rem" }} />
          <Card.Body style={{ width: '22rem' }}>
            <input
              value={docId}
              onChange={inputHandler}
              placeholder="Document ID of existing document"
              type="text"
            />
            <div className="home-btns-wrapper">
              <Link to={docId && `/rooms/documents/${docId}`}>
                  <Button variant="primary" className="home-btns" disabled={docId ? false : true}>Open Document</Button>
              </Link>
              <Link to="/rooms">
                <Button variant="primary" className="home-btns">New Document</Button>
              </Link>
            </div>
            <div className="home-instruction">
              <Accordion>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                      Instructions
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Card.Text>
                        Document ID can be found in the Document URL
                      </Card.Text>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;
