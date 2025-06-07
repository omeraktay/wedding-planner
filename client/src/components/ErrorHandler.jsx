import React from 'react';

const ErrorHandler = ({ error, clearError }) => {
  if (!error) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error:</strong> {error}
      {clearError && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={clearError}
        />
      )}
    </div>
  );
};

export default ErrorHandler;
