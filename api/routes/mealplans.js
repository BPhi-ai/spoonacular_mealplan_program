import express from 'express';

import { addMealPlan, deleteMealPlan } from '../controllers/mealplans.js';

import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

//POST /mealplans/
router.post('/', verifyUser, addMealPlan);


//DEL /mealplans/:id
router.delete('/:id', deleteMealPlan);

export default router;