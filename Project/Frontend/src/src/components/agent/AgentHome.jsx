import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Nav,
  Navbar,
  Card,
  Alert,
  Collapse
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import Footer from '../common/FooterC';

const AgentHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [toggle, setToggle] = useState({});
  const [agentComplaints, setAgentComplaints] = useState([]);

  useEffect(() => {
    const fetchAgentComplaints = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return navigate('/');

        const { _id, name } = user;
        setUserName(name);

        const { data } = await axios.get(`http://localhost:8000/allcomplaints/${_id}`);
        // Flatten _doc if present
        const complaints = data.map((item) =>
          item._doc
            ? { ...item._doc, _id: item._id, name: item.name }
            : item
        );
        setAgentComplaints(complaints);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAgentComplaints();
  }, [navigate]);

  const handleStatusChange = async (complaintId) => {
    try {
      await axios.put(`http://localhost:8000/complaint/${complaintId}`, { status: 'completed' });

      setAgentComplaints((prev) =>
        prev.map((comp) =>
          comp.complaintId === complaintId ? { ...comp, status: 'completed' } : comp
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = (complaintId) => {
    setToggle((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId]
    }));
  };

  const LogOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="dark" expand="lg" className="text-white">
        <Container fluid>
          <Navbar.Brand className="text-white">Hi Agent {userName}</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto text-white my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <NavLink to="#" className="text-white" style={{ textDecoration: 'none' }}>
                View Complaints
              </NavLink>
            </Nav>
            <Button onClick={LogOut} variant="outline-danger">
              Log out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', margin: '20px' }}>
        {agentComplaints.length > 0 ? (
          agentComplaints.map((complaint, index) => {
            const open = toggle[complaint.complaintId] || false;

            return (
              <Card key={index} style={{ width: '18rem', margin: '15px' }}>
                <Card.Body>
                  <Card.Title><b>Name:</b> {complaint.name}</Card.Title>
                  <Card.Text><b>Address:</b> {complaint.address}</Card.Text>
                  <Card.Text><b>City:</b> {complaint.city}</Card.Text>
                  <Card.Text><b>State:</b> {complaint.state}</Card.Text>
                  <Card.Text><b>Pincode:</b> {complaint.pincode}</Card.Text>
                  <Card.Text><b>Comment:</b> {complaint.comment}</Card.Text>
                  <Card.Text><b>Status:</b> {complaint.status}</Card.Text>

                  {complaint.status !== 'completed' && (
                    <Button
                      onClick={() => handleStatusChange(complaint.complaintId)}
                      variant="primary"
                    >
                      Mark as Completed
                    </Button>
                  )}

                  <Button
                    onClick={() => handleToggle(complaint.complaintId)}
                    aria-controls={`collapse-${complaint.complaintId}`}
                    aria-expanded={open}
                    className="mx-3"
                    variant="primary"
                  >
                    Message
                  </Button>

                  <Collapse in={open}>
                    <div id={`collapse-${complaint.complaintId}`}>
                      <Card body style={{ width: '250px', marginTop: '12px' }}>
                        <ChatWindow complaintId={complaint.complaintId} name={userName} />
                      </Card>
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <Alert variant="info">
            <Alert.Heading>No complaints to show</Alert.Heading>
          </Alert>
        )}
      </div>

      <Footer style={{ marginTop: '66px' }} />
    </>
  );
};

export default AgentHome;
