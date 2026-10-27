import express from 'express';
import { addReview, getMovieReviews } from '../controllers/reviewController.js';
import fetchUser from '../middlewares/fetchUser.js';

const router = express.Router();

router.post('/', fetchUser, addReview);
router.get('/:movieId', getMovieReviews);

export default router;
