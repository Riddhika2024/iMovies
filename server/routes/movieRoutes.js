import express from 'express';
import {
  getMovies,
  getCuratedSections,
  syncTMDBMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

// Curated sections for Prime Video layout
router.get('/curated/sections', getCuratedSections);

// TMDB / Full catalog synchronization
router.get('/sync-tmdb', syncTMDBMovies);
router.post('/sync-tmdb', syncTMDBMovies);

// Standard Movies CRUD
router.get('/', getMovies);
router.get('/:movieId', getMovieById);
router.post('/', adminAuth, createMovie);
router.put('/:movieId', adminAuth, updateMovie);
router.delete('/:movieId', adminAuth, deleteMovie);

export default router;
