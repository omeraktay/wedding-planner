import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import ErrorHandler from '../components/ErrorHandler';

export default function TodoList() {
  const { getAccessTokenSilently } = useAuth0();
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({ title: '', deadline: '' });
  const [editTodo, setEditTodo] = useState(null);
  const [defaultsLoaded, setDefaultsLoaded] = useState(() => {
    return localStorage.getItem('defaultsLoaded') === 'true';
  });
  const [fadeOut, setFadeOut] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [deadlineFilter, setDeadlineFilter] = useState(''); 
  const [sortOption, setSortOption] = useState('deadlineAsc'); 
  const filterPanelRef = useRef(null);
  const [error, setError] = useState(null)

  useEffect(() => {
  const fetchTodos = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:3000/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  
    fetchTodos();
  }, [getAccessTokenSilently]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        'http://localhost:3000/api/todos',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos((prev) => [...prev, res.data]);
      setFormData({ title: '', deadline: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadDefaults = async () => {
    if (defaultsLoaded) return;

    try {
      const token = await getAccessTokenSilently();
      await axios.post('http://localhost:3000/api/todos/load-defaults', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTodos();
      
      setDefaultsLoaded(true);
      localStorage.setItem('defaultsLoaded', 'true');

    } catch (error) {
      console.error('Error loading defaults:', error);
    }
  };


  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:3000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTodo = async (id, newStatus) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.put(
        `http://localhost:3000/api/todos/${id}`,
        { completed: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (todo) => {
    setEditTodo({ ...todo });
    const modal = new bootstrap.Modal(
      document.getElementById('editTodoModal')
    );
    modal.show();
  };

  const handleEditChange = (field, value) => {
    setEditTodo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateTodo = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.put(
        `http://localhost:3000/api/todos/${editTodo._id}`,
        editTodo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos((prev) =>
        prev.map((t) => (t._id === res.data._id ? res.data : t))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (filterPanelRef.current) {
      const bsCollapse = bootstrap.Collapse.getInstance(filterPanelRef.current);
      if (bsCollapse) {
        bsCollapse.hide(); 
      }
    }
  }, [statusFilter, deadlineFilter, sortOption]);

  return (
    <div className="container mt-4">
      <ErrorHandler error={error} clearError={() => setError(null)} />
      <h2>Wedding To-Do List</h2>

      {/* Add Todo Form */}
      <form id='todoForm' className="mb-3" onSubmit={handleAdd}>
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="To-do title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-primary w-100" type="submit">
              Add Todo
            </button>
          </div>
          {/* {!defaultsLoaded && ( */}
            <div className={`col-md-2 fade ${fadeOut ? 'opacity-0' : 'opacity-100'}`} style={{ transition: 'opacity 0.5s ease-in-out' }}>
              <button
                className="btn btn-outline-secondary w-100"
                type="button"
                onClick={() => {
                  setFadeOut(true);
                  setTimeout(handleLoadDefaults, 500); 
                }}
                data-bs-toggle="tooltip"
                title="Click to load a must-have wedding checklist. You can also edit-delete or set a deadline."
              >
                Checklist
              </button>
            </div>
          {/* )} */}
        </div>
      </form>
        <button
          className="btn btn-outline-primary mb-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#filterPanel"
          aria-expanded="false"
          aria-controls="filterPanel"
        >
          Filters & Sorting
        </button>
        <div className="collapse mb-3" id="filterPanel" ref={filterPanelRef}>
          <div className="card card-body bg-light">
                  {/* Filters */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Filter by status:</label>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="completed">Completed</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Filter by deadline:</label>
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={deadlineFilter}
                      onChange={(e) => setDeadlineFilter(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      className="btn btn-outline-secondary w-100 mb-2"
                      onClick={() => {
                        setStatusFilter('all');
                        setDeadlineFilter('');
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Sort by:</label>
                    <select
                      className="form-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="deadlineAsc">Deadline ↑</option>
                      <option value="deadlineDesc">Deadline ↓</option>
                      <option value="titleAsc">Title A–Z</option>
                      <option value="titleDesc">Title Z–A</option>
                    </select>
                  </div>
                </div>
          </div>
        </div>


      {/* Todo List */}
      <ul className="list-group mb-4">
        {todos
          .filter((todo) => {
            if (statusFilter === 'completed' && !todo.completed) return false;
            if (statusFilter === 'incomplete' && todo.completed) return false;
            if (deadlineFilter && todo.deadline) {
              return new Date(todo.deadline) <= new Date(deadlineFilter);
            }
            return true;
          })
          .sort((a, b) => {
            switch (sortOption) {
              case 'deadlineAsc':
                return new Date(a.deadline || Infinity) - new Date(b.deadline || Infinity);
              case 'deadlineDesc':
                return new Date(b.deadline || 0) - new Date(a.deadline || 0);
              case 'titleAsc':
                return a.title.localeCompare(b.title);
              case 'titleDesc':
                return b.title.localeCompare(a.title);
              default:
                return 0;
            }
          }).map((todo) => (
          <li
            key={todo._id}
            className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
          >
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3" style={{ width: '75%' }}>
              <div>
                <input
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => toggleTodo(todo._id, !todo.completed)}
                />{' '}
                <strong>{todo.title}</strong>
              </div>
              {todo.deadline && (
                <div className="text-muted">Deadline: {todo.deadline.slice(0, 10)}</div>
              )}
            </div>
            <div>
              <button
                className="btn btn-sm btn-secondary me-2"
                onClick={() => openEditModal(todo)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(todo._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      <div className="modal fade" id="editTodoModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          {editTodo && (
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit To-Do</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="To-do title"
                  value={editTodo.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                />
                <input
                  type="date"
                  className="form-control"
                  value={editTodo.deadline?.slice(0, 10) || ''}
                  onChange={(e) => handleEditChange('deadline', e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleUpdateTodo}
                >
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
