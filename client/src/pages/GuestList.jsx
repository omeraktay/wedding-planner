import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function capitalize(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

function GuestList() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', rsvp: 'Maybe' });
  const [editId, setEditId] = useState(null);

  const fetchGuests = async () => {
    if (isLoading || !isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:3000/api/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchGuests();
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();

    try {
      if (editId) {
        const res = await axios.put(`http://localhost:3000/api/guests/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGuests(prev => prev.map(g => (g._id === editId ? res.data : g)));
        setEditId(null);
      } else {
        const res = await axios.post('http://localhost:3000/api/guests', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGuests(prev => [...prev, res.data]);
      }
      setFormData({ name: '', email: '', rsvp: 'Maybe' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:3000/api/guests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (guest) => {
    setFormData({ name: guest.name, email: guest.email, rsvp: guest.rsvp });
    setEditId(guest._id);
  };

  if (!isAuthenticated) return <p>Please log in to view your guests.</p>;

  return (
    <div className="container mt-4">
      <h2>Guest List</h2>

      <form className="mb-4" onSubmit={handleAddOrUpdate}>
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
            <button className="btn btn-primary w-100" type="submit">
              {editId ? 'Update Guest' : 'Add Guest'}
            </button>
          </div>
        </div>
      </form>

      <ul className="list-group">
        {guests.map(guest => (
          <li key={guest._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{capitalize(guest.name)}</strong> ({guest.rsvp}) {guest.email && `- ${guest.email}`}
            </div>
            <div>
              <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(guest)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(guest._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuestList;
