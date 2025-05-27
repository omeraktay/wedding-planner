import express from 'express';
import { getGuests, addGuest, deleteGuest } from '../controller/guestController.js';
import { checkJwt } from "../middleware/auth.js";

const router = express.Router();

router.get('/', checkJwt, getGuests);
router.post('/', checkJwt, addGuest);
router.delete('/:id', checkJwt, deleteGuest);

export default router;