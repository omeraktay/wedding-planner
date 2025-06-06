import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import capitalize from '../components/Capitalize';
import ErrorHandler from '../components/ErrorHandler';

function GuestList() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', rsvp: 'Pending', plusOnes: 0 });
  const [editGuest, setEditGuest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [error, setError] = useState(null);

  const fetchGuests = async () => {
    if (isLoading || !isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:3000/api/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchGuests();
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    try {
      const res = await axios.post('http://localhost:3000/api/guests', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(prev => [...prev, res.data]);
      setFormData({ name: '', email: '', rsvp: 'Pending' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:3000/api/guests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(prev => prev.filter(g => g._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (guest) => {
    setEditGuest({ ...guest });
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  const handleEditChange = (field, value) => {
    setEditGuest(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    const token = await getAccessTokenSilently();
    try {
      const res = await axios.put(`http://localhost:3000/api/guests/${editGuest._id}`, editGuest, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(prev => prev.map(g => (g._id === editGuest._id ? res.data : g)));
      setEditGuest(null);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmed = guests.filter(g => g.rsvp === 'Confirmed');
  const declined = guests.filter(g => g.rsvp === 'Declined');
  const pending = guests.filter(g => g.rsvp === 'Pending');
  const totalExpected = confirmed.reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0); 
  
  if (!isAuthenticated) return <p>Please log in to view your guests.</p>;
  
  return (
    <div className="container mt-4">
      <h2>Guest List</h2>
      <ErrorHandler error={error} clearError={() => setError(null)} />

      {/* Add Form */}
      <form id='form' className="mb-4" onSubmit={handleAdd}>
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
              <option>Confirmed</option>
              <option>Declined</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="+Guests"
              value={formData.plusOnes === 0 ? "" : formData.plusOnes}
              onChange={e => setFormData({ ...formData, plusOnes: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">Add Guest</button>
          </div>
        </div>
      </form>

      <div className="mb-3">
        <label className="form-label me-2">Filter by RSVP:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Confirmed</option>
          <option>Declined</option>
          <option>Pending</option>
        </select>
      </div>

      <p> Total confirmed guests: <strong>{ totalExpected }</strong> (+Guests are included), <br /> 
      Pending guests: <strong>{pending.length}</strong>, <br /> 
      Declined guests: <strong>{declined.length}</strong>  </p>

        {/* Guest List */}
      <ul className="list-group mb-4">
        {guests
          .filter(guest => filterStatus === 'All' || guest.rsvp === filterStatus)
          .map(guest => (
          <li key={guest._id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center' style={{width: "80%"}}>
              <div>
                <strong>{capitalize(guest.name)}</strong> 
              </div>
              <div>
                {guest.email && `${guest.email}`}
              </div>
              <div>
                {guest.rsvp} {guest.rsvp === 'Confirmed' && guest.plusOnes > 0 && `(+${guest.plusOnes})`}
              </div>
            </div>
            <div>
              <button className="btn btn-secondary btn-sm me-2" onClick={() => openEditModal(guest)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(guest._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          {editGuest && (
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Guest</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Guest name"
                  value={capitalize(editGuest.name)}
                  onChange={e => handleEditChange('name', e.target.value)}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={editGuest.email}
                  onChange={e => handleEditChange('email', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  className="form-control mb-2"
                  placeholder="+Guests"
                  value={editGuest.plusOnes === 0 ? "" : editGuest.plusOnes}
                  onChange={e => handleEditChange('plusOnes', parseInt(e.target.value) || 0)}
                />
                <select
                  className="form-select"
                  value={editGuest.rsvp}
                  onChange={e => handleEditChange('rsvp', e.target.value)}
                >
                  <option>Confirmed</option>
                  <option>Declined</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GuestList;
