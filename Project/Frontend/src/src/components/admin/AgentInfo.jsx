import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  Alert,
  Container,
  Collapse,
  Form
} from 'react-bootstrap';
import axios from 'axios';
import Footer from '../common/FooterC';

const AgentInfo = () => {
  const navigate = useNavigate();
  const [agentList, setAgentList] = useState([]);
  const [toggle, setToggle] = useState({});
  const [updateData, setUpdateData] = useState({});

  // Fetch all agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/AgentUsers');
        setAgentList(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAgents();
  }, [navigate]);

  // Handle input change for a specific agent
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value
      }
    }));
  };

  // Submit updated data
  const handleSubmit = async (e, id) => {
    e.preventDefault();
    const agentUpdate = updateData[id];

    if (!agentUpdate || (!agentUpdate.name && !agentUpdate.email && !agentUpdate.phone)) {
      alert("Please fill in at least one field to update.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to update the agent?");
    if (!confirmed) return;

    try {
      await axios.put(`http://localhost:8000/user/${id}`, agentUpdate);
      alert("Agent updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this agent?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/OrdinaryUsers/${id}`);
      setAgentList((prev) => prev.filter((agent) => agent._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle form visibility
  const handleToggle = (id) => {
    setToggle((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <div className="body">
        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agentList.length > 0 ? (
                agentList.map((agent) => {
                  const open = toggle[agent._id] || false;
                  const currentUpdate = updateData[agent._id] || {
                    name: agent.name,
                    email: agent.email,
                    phone: agent.phone,
                  };

                  return (
                    <tr key={agent._id}>
                      <td>{agent.name}</td>
                      <td>{agent.email}</td>
                      <td>{agent.phone}</td>
                      <td>
                        <Button
                          onClick={() => handleToggle(agent._id)}
                          aria-controls={`collapse-${agent._id}`}
                          aria-expanded={open}
                          className="mx-2"
                          variant="outline-warning"
                        >
                          Update
                        </Button>

                        <Collapse in={open}>
                          <div id={`collapse-${agent._id}`}>
                            <Form
                              onSubmit={(e) => handleSubmit(e, agent._id)}
                              className="p-3"
                            >
                              <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={currentUpdate.name}
                                  onChange={(e) => handleChange(e, agent._id)}
                                  placeholder="Enter name"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={currentUpdate.email}
                                  onChange={(e) => handleChange(e, agent._id)}
                                  placeholder="Enter email"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  value={currentUpdate.phone}
                                  onChange={(e) => handleChange(e, agent._id)}
                                  placeholder="Enter phone no."
                                />
                              </Form.Group>

                              <Button
                                size="sm"
                                variant="outline-success"
                                type="submit"
                              >
                                Submit
                              </Button>
                            </Form>
                          </div>
                        </Collapse>

                        <Button
                          onClick={() => deleteUser(agent._id)}
                          className="mx-2"
                          variant="outline-danger"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">
                    <Alert variant="info" className="text-center m-2">
                      <Alert.Heading>No Agents to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default AgentInfo;
