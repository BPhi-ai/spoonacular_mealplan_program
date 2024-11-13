import express from 'express';

import { searchMeals } from '../controllers/meals.js';

const router = express.Router();

// GET /meals/search
router.get('/search', searchMeals);

export default router;