import express from 'express';
import { checkJwt } from '../middleware/auth.js';
import { getBudgetItems, addBudgetItem, updateBudgetItem, deleteBugetItem } from '../controller/budgetController.js';

const budgetRouter = express.Router();

budgetRouter.get('/', checkJwt, getBudgetItems);
budgetRouter.post('/', checkJwt, addBudgetItem);
budgetRouter.put('/:id', checkJwt, updateBudgetItem);
budgetRouter.delete('/:id', checkJwt, deleteBugetItem);

export default budgetRouter;