// components/BudgetTracker/BudgetItem.jsx
import React, { useState } from 'react';
import EditBudgetModal from './EditBudgetModal';

const BudgetItem = ({ item, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item._id);
    }
  };

  return (
    <>
      <div className="card mb-2 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{item.name}</h5>
            <div className="text-muted small">
              Category: {item.category || '—'} | Estimated: ${item.estimatedCost} | Actual: ${item.actualCost} | Status: {item.status}
            </div>
          </div>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setShowModal(true)}>
              Edit
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <EditBudgetModal
        show={showModal}
        onClose={() => setShowModal(false)}
        item={item}
        onSave={onUpdate}
      />
    </>
  );
};

export default BudgetItem;
