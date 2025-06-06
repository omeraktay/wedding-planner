// src/components/TableSetup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function TableSetup() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [tableCount, setTableCount] = useState('');
  const [seatsPerTable, setSeatsPerTable] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch existing config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get('http://localhost:3000/api/seating-chart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setTableCount(res.data.tableCount);
          setSeatsPerTable(res.data.seatsPerTable);
        }
      } catch (err) {
        console.error('Failed to fetch seating chart:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchConfig();
  }, [getAccessTokenSilently, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        'http://localhost:3000/api/seating-chart',
        { tableCount: Number(tableCount), seatsPerTable: Number(seatsPerTable) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Seating configuration saved! Refresh the page to see the new seating chart.');
    } catch (err) {
      console.error('Failed to save seating chart:', err);
      alert('Error saving seating chart.');
    }
  };

  if (!isAuthenticated) return <p>Please log in to configure your seating chart.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Seating Chart Setup</h2>
      <form onSubmit={handleSubmit} className="row g-3" style={{marginBottom: '20px'}}>
        <div className="col-md-5">
          <label className="form-label">Number of Tables</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={tableCount}
            onChange={(e) => setTableCount(e.target.value)}
            required
          />
        </div>
        <div className="col-md-5">
          <label className="form-label">Seats per Table</label>
          <input
            type="number"
            min="1"
            max="12"
            className="form-control"
            value={seatsPerTable}
            onChange={(e) => setSeatsPerTable(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" style={{marginTop: "31px"}}  type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default TableSetup;
