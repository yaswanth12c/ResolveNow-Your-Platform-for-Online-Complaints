import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';
import ChatWindow from '../common/ChatWindow';
import Collapse from 'react-bootstrap/Collapse';

const Status = () => {
  const [toggle, setToggle] = useState({});
  const [statusComplaints, setStatusComplaints] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const { _id } = JSON.parse(storedUser);
    axios.get(`http://localhost:8000/status/${_id}`)
      .then((res) => {
        setStatusComplaints(res.data);
      })
      .catch((err) => {
        console.error('Error fetching complaints:', err);
      });
  }, []);

  const handleToggle = (complaintId) => {
    setToggle((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }));
  };

  return (
    <div className="d-flex flex-wrap m-3">
      {statusComplaints.length > 0 ? (
        statusComplaints.map((complaint) => {
          const isOpen = toggle[complaint._id] || false;

          return (
            <Card key={complaint._id} className="m-2" style={{ width: '19rem' }}>
              <Card.Body>
                <Card.Title>Name: {complaint.name}</Card.Title>
                <Card.Text>Address: {complaint.address}</Card.Text>
                <Card.Text>City: {complaint.city}</Card.Text>
                <Card.Text>State: {complaint.state}</Card.Text>
                <Card.Text>Pincode: {complaint.pincode}</Card.Text>
                <Card.Text>Comment: {complaint.comment}</Card.Text>
                <Card.Text><strong>Status:</strong> {complaint.status}</Card.Text>

                <Button
                  variant="primary"
                  onClick={() => handleToggle(complaint._id)}
                  aria-controls={`collapse-${complaint._id}`}
                  aria-expanded={isOpen}
                >
                  Message
                </Button>

                <Collapse in={isOpen}>
                  <div id={`collapse-${complaint._id}`}>
                    <Card body className="mt-3">
                      <ChatWindow
                        key={complaint._id}
                        complaintId={complaint._id}
                        name={complaint.name}
                      />
                    </Card>
                  </div>
                </Collapse>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <Alert variant="info" className="w-100">
          <Alert.Heading>No complaints to show</Alert.Heading>
          <p>Please register a complaint to view status and start a conversation.</p>
        </Alert>
      )}
    </div>
  );
};

export default Status;
