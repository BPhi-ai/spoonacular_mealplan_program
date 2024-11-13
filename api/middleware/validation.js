import User from "../models/user.js";

const verifyUserMealPlan = async (req, res, next) => {
    try {
        const { user_id } = req.verified;

        const mealplan_id = req.params.id;

        const user = await User.findById(user_id).select('mealplans');
        
        if (!user.mealplans.include(mealplan_id)) {
            return res.status(401).json({ error: 'The meal is not in the mealplan.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export { verifyUserMealPlan };