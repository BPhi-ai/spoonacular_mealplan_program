import mongoose from "mongoose";

const MealPlanSchema = new mongoose.Schema({
    mealplan: {
        user_id: {
            type: Number,
            required: true
        },
        week: {
            type: Number,
            required: true
        },
        meal: {
            mealId: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            diets: [String],
            image: {
                type: String,
                required: true
            }
        }
    }
});

const MealPlans = mongoose.model('MealPlans', MealPlanSchema);

export default MealPlans;