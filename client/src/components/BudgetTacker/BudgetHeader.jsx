// components/BudgetTracker/BudgetHeader.jsx
import React, { useState } from 'react';

const BudgetHeader = ({ totalBudget, onUpdateBudget }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(totalBudget);

  const handleSave = () => {
    onUpdateBudget(Number(newBudget));
    setIsEditing(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h4>Total Budget:</h4>
      {isEditing ? (
        <div className="d-flex align-items-center">
          <input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="form-control me-2"
            style={{ width: '150px' }}
          />
          <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <span className="fs-5 me-3">${totalBudget.toLocaleString()}</span>
          <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetHeader;
