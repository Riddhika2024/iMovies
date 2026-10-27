import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/:movieId', getMovieById);
router.post('/', adminAuth, createMovie);
router.put('/:movieId', adminAuth, updateMovie);
router.delete('/:movieId', adminAuth, deleteMovie);

export default router;
