import express from 'express';
import {
  getShowsByMovie,
  getShowById,
  createShow,
  deleteShow,
} from '../controllers/showController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

router.get('/movie/:movieId', getShowsByMovie);
router.get('/:showId', getShowById);
router.post('/', adminAuth, createShow);
router.delete('/:showId', adminAuth, deleteShow);

export default router;
