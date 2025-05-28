// client/src/pages/GuestList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function GuestList() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', rsvp: 'Maybe' });
  const [newGuest, setNewGuest] = useState('');

  // Fetch guests
  const fetchGuests = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:5000/api/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchGuests();
  }, [isAuthenticated]);

  // Add guest
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post('http://localhost:5000/api/guests', formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setGuests(prev => [...prev, res.data]);
      setFormData({ name: '', email: '', rsvp: 'Maybe' });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete guest
  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:5000/api/guests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) return <p>Please log in to view your guests.</p>;

  return (
    <div className="container mt-4">
      <h2>Guest List</h2>

      <form className="mb-4" onSubmit={handleAdd}>
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Guest name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={formData.rsvp}
              onChange={e => setFormData({ ...formData, rsvp: e.target.value })}
            >
              <option>Yes</option>
              <option>No</option>
              <option>Maybe</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">Add Guest</button>
          </div>
        </div>
      </form>

      <ul className="list-group">
        {guests.map(guest => (
          <li key={guest._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{guest.name}</strong> ({guest.rsvp}) {guest.email && `- ${guest.email}`}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(guest._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuestList;

