import express from 'express';
import { checkJwt } from '../middleware/auth.js';
import { saveUpdateSeating, getSeating, saveAssignments, getAssignments } from '../controller/seatController.js';

const seatingRouter = express.Router();

seatingRouter.get('/', checkJwt, getSeating);
seatingRouter.post('/', checkJwt, saveUpdateSeating);
seatingRouter.post('/assignments', checkJwt, saveAssignments);
seatingRouter.get('/assignments', checkJwt, getAssignments);



export default seatingRouter;