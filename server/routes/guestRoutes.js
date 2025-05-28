import express from 'express';
import { getGuests, addGuest, deleteGuest } from '../controller/guestController.js';
import { checkJwt } from "../middleware/auth.js";

const guestRouter = express.Router();

guestRouter.get('/', checkJwt, getGuests);
guestRouter.post('/', checkJwt, addGuest);
guestRouter.delete('/:id', checkJwt, deleteGuest);

export default guestRouter;