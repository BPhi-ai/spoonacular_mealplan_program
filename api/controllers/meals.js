import axios from 'axios';
import User from '../models/user.js';

const SPOONFUL_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONFUL_API_URL = process.env.SPOONACULAR_API_URL;

const searchMeals = async (req, res) => {
    try {
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        if(!user) {
            return res.status(404).json({error: 'User not found.' });
        }

        let dietText = "";
        user.preferences.forEach((pref) => {
            dietText = dietText.concat(",", pref);
        });

        const { meal, diets = dietText } = req.query;

        const meals = await axios.get(`${SPOONFUL_API_URL}/recipes/complexSearch`, {
            params: {
                apiKey: SPOONFUL_API_KEY,
                query: meal,
                diet: diets,
                addRecipeInformation: true
            }
        })
        res.json(meals.data.results);

    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export { searchMeals };