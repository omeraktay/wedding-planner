import express from 'express';
import { checkJwt } from '../middleware/auth.js';
import { setBudget, getOverallBudget, updateOverallBudget } from '../controller/overallBudgetController.js';

const overallBudgetRouter = express.Router();

overallBudgetRouter.get('/', checkJwt, getOverallBudget);
overallBudgetRouter.post('/', checkJwt, setBudget);
overallBudgetRouter.put('/:id', checkJwt, updateOverallBudget);

export default overallBudgetRouter;