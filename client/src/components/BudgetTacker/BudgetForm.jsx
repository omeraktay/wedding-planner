// components/BudgetTracker/BudgetForm.jsx
import React, { useState } from 'react';

const BudgetForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    estimatedCost: '',
    actualCost: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.estimatedCost) {
      alert('Please enter a name and estimated cost.');
      return;
    }

    const newItem = {
      ...form,
      estimatedCost: Number(form.estimatedCost),
      actualCost: form.actualCost ? Number(form.actualCost) : 0,
    };

    onAdd(newItem);
    setForm({ name: '', category: '', estimatedCost: '', actualCost: '', status: 'Pending' });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Estimated Cost *</label>
          <input
            type="number"
            name="estimatedCost"
            value={form.estimatedCost}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Actual Cost</label>
          <input
            type="number"
            name="actualCost"
            value={form.actualCost}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default BudgetForm;
