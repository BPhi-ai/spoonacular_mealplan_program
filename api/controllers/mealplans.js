import MealPlan from '../models/mealplan.js';

const MAX_MEALS = 3;

//POST /mealplans/
const addMealPlan = async (req, res) => {
    try {
       const { user_id } = req.headers;
       const { week, meals } = req.body;
       
       if(!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
       }
       const mealplan = await MealPlan.findOne({week: week});
       if(mealplan) {
         if(mealplan.meals.length >= MAX_MEALS) {
            res.status(403).json({message: 'The selected mealplan has too many meals in one week, please try again.' });
         } else {
            const updateMeal = await MealPlan.updateOne({week: week}, {$push: {meals: meals}});
            res.json(updateMeal);
         }
       } else {
         const addMeal = await MealPlan.insertMany({user_id, week, meals});
         res.json(addMeal);
       }
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
}

//DEL /mealplans/:id (mealId)
const deleteMealPlan = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { week } = req.params;

        if(!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        const removeMeal = await MealPlan.deleteOne(week);
        res.json(removeMeal);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export {addMealPlan, deleteMealPlan};