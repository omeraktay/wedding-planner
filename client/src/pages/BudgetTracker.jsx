import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import OverallBudget from '../components/BudgetTacker/OverallBudget';
import { useBudget } from '../components/BudgetContext';
import capitalize from '../components/Capitalize';
import ErrorHandler from '../components/ErrorHandler';


const BudgetTracker = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [budgetItems, setBudgetItems] = useState([]);
  const { savedOverallBudget } = useBudget();
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    estimatedCost: '',
    actualCost: '',
    status: 'Pending',
  });
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchBudgetData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:3000/api/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgetItems(res.data);
    } catch (error) {
      console.error('Failed to fetch budget items', error);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post('http://localhost:3000/api/budget', newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgetItems(prev => [...prev, res.data]);
      setNewItem({
        name: '',
        category: '',
        estimatedCost: '',
        actualCost: '',
        status: 'Pending',
      });
    } catch (error) {
      console.error('Failed to add item', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:3000/api/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgetItems(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const handleUpdate = async (id, updatedItem) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.put(`http://localhost:3000/api/budget/${id}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgetItems(prev =>
        prev.map(item => (item._id === id ? {...res.data} : item))
      );
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const overallBudget = savedOverallBudget;
  const totalActual = budgetItems.reduce((sum, item) => sum + Number(item.actualCost || 0), 0);
  const remaining = overallBudget - totalActual;
  const twentyPercent = savedOverallBudget * 0.2

  return (
    <div className="container mt-4">
      <h2>💰 Budget Tracker</h2>
      <ErrorHandler error={error} clearError={() => setError(null)} />
      <OverallBudget getBudget={overallBudget} />

      <div className="mb-3">
        <label className="form-label me-2">Filter by Status:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Paid</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem}>
        <div className="row g-2 mb-4">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Description*"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Category"
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Estimated*"
              value={newItem.estimatedCost}
              onChange={e => setNewItem({ ...newItem, estimatedCost: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Actual"
              value={newItem.actualCost}
              onChange={e => setNewItem({ ...newItem, actualCost: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-control"
              value={newItem.status}
              onChange={e => setNewItem({ ...newItem, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="col-md-1">
            <button className="btn btn-primary w-100" type='submit'>
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Budget List */}
      <ul className="list-group mb-4">
        {budgetItems
        .filter(item => filterStatus === "All" || item.status === filterStatus)
        .map(item => (
          <li key={item._id} className="list-group-item d-flex align-items-center justify-content-between">
            <div>
              <strong>{capitalize(item.name)}</strong> ({capitalize(item.category) || 'Uncategorized'})<br />
              Estimated: ${item.estimatedCost} | Actual: ${item.actualCost} | Status: {item.status}
            </div>
            <div>
              <button
                className="btn btn-sm btn-warning me-2 mb-1"
                onClick={() => setEditingItem(item)}
              >
                Edit
              </button>
              <button className="btn btn-sm btn-danger mb-1" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className={remaining >= twentyPercent ? "alert alert-success" : "alert alert-danger"}>
        <strong>Total Spent:</strong> ${totalActual.toFixed(2)} <br />
        <strong>Remaining Budget:</strong> ${remaining.toFixed(2)} <br />
        <strong>{twentyPercent > remaining ? "You spent more than 80% of your budget! (Pending payments are included.)" : ""}</strong>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Budget Item</h5>
                <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Description"
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  placeholder="Category"
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  value={editingItem.actualCost}
                  onChange={(e) => setEditingItem({ ...editingItem, actualCost: e.target.value })}
                  placeholder="Actual Cost"
                />
                <select
                  className="form-control"
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                 onClick={() => {
                  const updated = {
                    ...editingItem,
                    actualCost: Number(editingItem.actualCost),
                    status: editingItem.status
                  };
                  handleUpdate(editingItem._id, updated);
                  fetchBudgetData();
                  setEditingItem();    
                }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;
