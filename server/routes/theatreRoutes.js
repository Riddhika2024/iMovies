import express from 'express';
import {
  getTheatres,
  getTheatreById,
  createTheatre,
  deleteTheatre,
} from '../controllers/theatreController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

router.get('/', getTheatres);
router.get('/:theatreId', getTheatreById);
router.post('/', adminAuth, createTheatre);
router.delete('/:id', adminAuth, deleteTheatre);

export default router;
