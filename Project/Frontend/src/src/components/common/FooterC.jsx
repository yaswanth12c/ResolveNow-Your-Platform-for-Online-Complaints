import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

export default function FooterC() {
  return (
    <MDBFooter
      bgColor='dark'
      className='text-center text-white'
      style={{ padding: '20px 0', marginTop: 'auto' }}
    >
      <div>
        <p style={{ margin: 0, fontSize: '16px' }}>ComplaintCare</p>
        <p style={{ margin: 0, fontSize: '14px' }}>&copy; {new Date().getFullYear()}</p>
      </div>
    </MDBFooter>
  );
}
