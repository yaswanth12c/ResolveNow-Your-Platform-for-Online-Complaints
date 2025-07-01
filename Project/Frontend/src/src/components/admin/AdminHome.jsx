import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

import UserInfo from './UserInfo';
import AccordionAdmin from "./AccordionAdmin";
import AgentInfo from './AgentInfo';

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.name) {
      setUserName(user.name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const LogOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="dark" expand="lg" className="text-white">
        <Container fluid>
          <Navbar.Brand className="text-white" href="#">
            Hi Admin {userName}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <span
                className={`nav-link text-light ${activeComponent === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveComponent('dashboard')}
                role="button"
              >
                Dashboard
              </span>
              <span
                className={`nav-link text-light ${activeComponent === 'UserInfo' ? 'active' : ''}`}
                onClick={() => setActiveComponent('UserInfo')}
                role="button"
              >
                User
              </span>
              <span
                className={`nav-link text-light ${activeComponent === 'Agent' ? 'active' : ''}`}
                onClick={() => setActiveComponent('Agent')}
                role="button"
              >
                Agent
              </span>
            </Nav>
            <Button onClick={LogOut} variant="outline-danger">
              Log out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="content">
        {activeComponent === 'Agent' && <AgentInfo />}
        {activeComponent === 'dashboard' && <AccordionAdmin />}
        {activeComponent === 'UserInfo' && <UserInfo />}
      </div>
    </>
  );
};

export default AdminHome;
