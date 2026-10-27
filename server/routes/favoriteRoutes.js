import express from 'express';
import { toggleFavorite, getUserFavorites } from '../controllers/favoriteController.js';
import fetchUser from '../middlewares/fetchUser.js';

const router = express.Router();

router.post('/toggle', fetchUser, toggleFavorite);
router.get('/', fetchUser, getUserFavorites);

export default router;
