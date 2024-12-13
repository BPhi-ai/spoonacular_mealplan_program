import MealPlan from '../models/mealplan.js';

const MAX_MEALS = 3;

//POST /mealplans/
const addMealPlan = async(req, res) => {
    try {
        const { user_id } = req.verified;
        const { week, meal } = req.body;

        const mealplan = await MealPlan.findOne({week: week});
        if(mealplan) {
            if(mealplan.meals.length >= MAX_MEALS) {
                res.status(403).json({message: 'The selected mealplan has 3 meals in one week, please try again.' });
            } else {
                const updateMealPlan = await MealPlan.updateOne({week: week}, {$push: {meals: meal}});
                res.json(updateMealPlan);
            }
        } else {
            const mealEntry = await MealPlan.create({user_id: user_id, week: week, meals: meal});
            res.json(mealEntry);
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

//DEL /mealplans/:id
const deleteMealPlan = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const {id} = req.params;

        if(!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }
        const meal = MealPlan.findById(id);
        meal.user_id = user_id;
        await meal.deleteOne();

        res.json({ mealplan_id: id, delete: 'success'});
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export { addMealPlan, deleteMealPlan };