import express from 'express';
import { getTodos, addTodo, updateTodo, deleteTodo, loadDefaultTodo } from '../controller/todoController.js';
import { checkJwt } from '../middleware/auth.js';

const todoRouter = express.Router();

todoRouter.get('/', checkJwt, getTodos);
todoRouter.post('/', checkJwt, addTodo);
todoRouter.put('/:id', checkJwt, updateTodo);
todoRouter.delete('/:id', checkJwt, deleteTodo);
todoRouter.post('/load-defaults', checkJwt, loadDefaultTodo);

export default todoRouter;
