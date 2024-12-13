import express from 'express';

import { searchMeals } from '../controllers/meal.js';
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

// GET /meals/search
router.get('/search', verifyUser, searchMeals);

export default router;