import express from 'express';

import { verifyUser } from '../middleware/authorization.js';
import { addMealPlan, deleteMealPlan } from '../controllers/mealplan.js';

const router = express.Router();

//POST /mealplans/
router.post('/', verifyUser, addMealPlan);

//DEL /mealplans/:id
router.delete('/:id', verifyUser, deleteMealPlan);

export default router;