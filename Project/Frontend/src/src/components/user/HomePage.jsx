import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import Complaint from '../user/Complaint';
import Status from '../user/Status';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Complaint');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <h1 className="navbar-brand text-light">Hi, {userName}</h1>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={`nav-link text-light ${activeComponent === 'Complaint' ? 'active' : ''}`}
                  onClick={() => handleComponentChange('Complaint')}
                >
                  Complaint Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link text-light ${activeComponent === 'Status' ? 'active' : ''}`}
                  onClick={() => handleComponentChange('Status')}
                >
                  Status
                </NavLink>
              </li>
            </ul>
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      <div className="body">
        <div className="container mt-4">
          {activeComponent === 'Complaint' && <Complaint />}
          {activeComponent === 'Status' && <Status />}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
