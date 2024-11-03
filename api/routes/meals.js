import express from 'express';
import axios from 'axios';

import { Users } from '../../db/mocks.js';

const router = express.Router();

const SPOONFUL_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONFUL_API_URL = process.env.SPOONACULAR_API_URL;

// GET /meals/search
router.get('/search', async (req, res) => {
    try {
       const user_id = Number(req.headers.user_id);

       //indicating that the user exists:
       const user = Users.find('_id', user_id);
       if(!user) {
          return res.status(404).json({ error: 'User not found'});
       }

       let dietText = "";
       const diet = user.preferences.forEach((pref) => {
            dietText = dietText.concat(",", pref);
       });
       
       const { meal, diets = dietText } = req.query;

       //making request to Spoonacular API
       const meals = await axios.get(`${SPOONFUL_API_URL}/recipes/complexSearch`, {
            params: {
                apiKey: SPOONFUL_API_KEY,
                query: meal,
                diet: diets,
                addRecipeInformation: true
            }
       });

       res.json(meals.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;