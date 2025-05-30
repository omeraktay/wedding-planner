import Todo from '../models/Todo.js';

const defaultTodos = [
    { title: 'Set wedding date'},
    { title: 'Book venue'},
    { title: 'Marriage license'},
    { title: 'Create guest list'},
    { title: 'Send invitations'},
    { title: 'Book officiant'},
    { title: 'Buy wedding dress'},
    { title: 'Buy wedding suit'},
    { title: 'Choose a caterer'},
    { title: 'Arrange reharsal dinner'},
    { title: 'Hire a photographer'},
    { title: 'Buy engagement rings'},
    { title: 'Book hair and makeup'},
    { title: 'Book florist'},
    { title: 'Plan honeymoon'}
]

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ createdBy: req.auth.sub }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTodo = async (req, res) => {
  try {
    const { title, deadline } = req.body;
    const newTodo = new Todo({
      title,
      deadline,
      createdBy: req.auth.sub
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.auth.sub },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.auth.sub
    });
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loadDefaultTodo = async (req, res) => {
  try {
    const createdTodos = await Todo.insertMany(
      defaultTodos.map(t => ({ ...t, createdBy: req.auth.sub }))
    );
    res.status(201).json(createdTodos);
  } catch (error) {
    console.log(`Error fetching default tasks.`)
    res.status(500).json({ message: error.message });
  }
};
