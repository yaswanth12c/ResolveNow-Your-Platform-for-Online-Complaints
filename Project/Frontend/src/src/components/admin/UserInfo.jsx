import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Alert,
  Container,
  Collapse,
  Form
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import axios from 'axios';

const UserInfo = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [toggle, setToggle] = useState({});
  const [updateData, setUpdateData] = useState({});

  // Fetch users on load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/OrdinaryUsers');
        setUserList(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [navigate]);

  // Handle form input change
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

  // Submit updated user
  const handleSubmit = async (e, id) => {
    e.preventDefault();
    const userUpdate = updateData[id];

    if (!userUpdate || (!userUpdate.name && !userUpdate.email && !userUpdate.phone)) {
      alert("Please fill in at least one field to update.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to update the user?");
    if (!confirmed) return;

    try {
      await axios.put(`http://localhost:8000/user/${id}`, userUpdate);
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle visibility
  const handleToggle = (id) => {
    setToggle((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Delete user
  const deleteUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/OrdinaryUsers/${id}`);
      setUserList((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
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
              {userList.length > 0 ? (
                userList.map((user) => {
                  const open = toggle[user._id] || false;
                  const currentUpdate = updateData[user._id] || {
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                  };

                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Button
                          onClick={() => handleToggle(user._id)}
                          aria-controls={`collapse-${user._id}`}
                          aria-expanded={open}
                          className="mx-2"
                          variant="outline-warning"
                        >
                          Update
                        </Button>

                        <Collapse in={open}>
                          <div id={`collapse-${user._id}`}>
                            <Form
                              onSubmit={(e) => handleSubmit(e, user._id)}
                              className="p-3"
                            >
                              <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={currentUpdate.name}
                                  onChange={(e) => handleChange(e, user._id)}
                                  placeholder="Enter name"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={currentUpdate.email}
                                  onChange={(e) => handleChange(e, user._id)}
                                  placeholder="Enter email"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  value={currentUpdate.phone}
                                  onChange={(e) => handleChange(e, user._id)}
                                  placeholder="Enter phone"
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
                          onClick={() => deleteUser(user._id)}
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
                      <Alert.Heading>No Users to show</Alert.Heading>
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

export default UserInfo;
