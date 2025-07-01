import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image1 from '../../Images/Image1.png';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Footer from './FooterC';

const Home = () => {
  return (
    <>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>ComplaintCare</Navbar.Brand>
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link text-light">SignUp</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link text-light">Login</Link>
            </li>
          </ul>
        </Container>
      </Navbar>

      {/* Home Content */}
      <Container className="home-container">
        <div className="left-side">
          <img src={Image1} alt="Customer Support" />
        </div>
        <div className="right-side">
          <p>
            <span className="f-letter">Empower Your Team,</span><br />
            <span className="s-letter">Exceed Customer Expectations: Discover our</span><br />
            <span className="t-letter">Complaint Management Solution</span><br />
            <Link to="/Login">
              <Button className="mt-3 register">Register your Complaint</Button>
            </Link>
          </p>
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
