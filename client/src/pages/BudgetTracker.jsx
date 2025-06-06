import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import OverallBudget from '../components/BudgetTacker/OverallBudget';
import { useBudget } from '../components/BudgetContext';

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

  const fetchBudgetData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:3000/api/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgetItems(res.data);
    } catch (err) {
      console.error('Failed to fetch budget items', err);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const handleAddItem = async () => {
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
    } catch (err) {
      console.error('Failed to add item', err);
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

  return (
    <div className="container mt-4">
      <h2>💰 Budget Tracker</h2>
      <OverallBudget getBudget={overallBudget} />

      {/* Add Item Form */}
      <div className="row g-2 mb-4">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Name*"
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
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
          <button className="btn btn-primary w-100" onClick={handleAddItem}>
            Add
          </button>
        </div>
      </div>

      {/* Budget List */}
      <ul className="list-group mb-4">
        {budgetItems.map(item => (
          <li key={item._id} className="list-group-item d-flex align-items-center justify-content-between">
            <div>
              <strong>{item.name}</strong> ({item.category || 'Uncategorized'})<br />
              Estimated: ${item.estimatedCost} | Actual: ${item.actualCost} | Status: {item.status}
            </div>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => setEditingItem(item)}
              >
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="alert alert-info">
        <strong>Total Spent:</strong> ${totalActual.toFixed(2)} <br />
        <strong>Remaining Budget:</strong> ${remaining.toFixed(2)}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal show fade d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Budget Item</h5>
                <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
              </div>
              <div className="modal-body">
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
                    setEditingItem(null);
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
