import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import capitalize from './Capitalize';

function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #ccc'
    }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        {isAuthenticated && (
          <Link to="/guests" style={{ marginRight: '1rem' }}>Guest List</Link>
        )}
        {isAuthenticated && (
          <Link to='/todo-list' style={{ marginRight: '1rem' }}>To-Do List</Link>
        )}
        {isAuthenticated && (
          <Link to="seating-setup" style={{ marginRight: '1rem' }}>Seating Planning</Link>
        )}
        {isAuthenticated && (
          <Link to="budget-tracker" style={{ marginRight: '1rem' }}>Budget Tracker</Link>
        )}
        {isAuthenticated && (
          <Link to="deneme" style={{ marginRight: '1rem' }}>deneme</Link>
        )}
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '1rem' }}>👤 {capitalize(user.name)}</span>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => loginWithRedirect()}>Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
