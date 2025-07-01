import axios from 'axios';
import React, { useState } from 'react';

const Complaint = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [userComplaint, setUserComplaint] = useState({
    userId: user?._id || '',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: '',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserComplaint((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setUserComplaint({
      userId: user?._id || '',
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      status: '',
      comment: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/Complaint/${user._id}`, userComplaint);
      alert('Your Complaint has been sent!');
      handleClear();
    } catch (err) {
      console.error(err);
      alert('Something went wrong!!');
    }
  };

  return (
    <div className="text-white complaint-box">
      <form onSubmit={handleSubmit} className="compliant-form row bg-dark">
        <div className="col-md-6 p-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input name="name" value={userComplaint.name} onChange={handleChange} type="text" className="form-control" id="name" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input name="address" value={userComplaint.address} onChange={handleChange} type="text" className="form-control" id="address" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="city" className="form-label">City</label>
          <input name="city" value={userComplaint.city} onChange={handleChange} type="text" className="form-control" id="city" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="state" className="form-label">State</label>
          <input name="state" value={userComplaint.state} onChange={handleChange} type="text" className="form-control" id="state" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <input name="pincode" value={userComplaint.pincode} onChange={handleChange} type="text" className="form-control" id="pincode" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="status" className="form-label">Status</label>
          <input
            name="status"
            placeholder="Type 'pending'"
            value={userComplaint.status}
            onChange={handleChange}
            type="text"
            className="form-control"
            id="status"
            required
          />
        </div>

        <div className="col-12 p-3">
          <label htmlFor="comment" className="form-label text-light">Description</label>
          <textarea name="comment" value={userComplaint.comment} onChange={handleChange} className="form-control" required></textarea>
        </div>

        <div className="text-center p-1 col-12">
          <button type="submit" className="mt-2 btn btn-success">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Complaint;
