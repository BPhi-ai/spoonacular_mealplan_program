import 'dotenv/config';
import mongoose from 'mongoose';

import User from './api/models/users.js';
import MealPlans from './api/models/mealplans.js';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_ADDRESS = process.env.DB_ADDRESS;
const DB_NAME = process.env.DB_NAME;

const connect = async () => {
    try {
        const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_ADDRESS}/?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(MONGO_URI, {dbName: DB_NAME });
        console.log('Connected to Mongo');
    } catch (error) {
        console.error(`Error connecting to Mongo: ${error.message}`);
    }
}

const userData = {
    username: 'admin',
    password: 'password',
    mealplans: [],
    preferences: ['vegan', 'vegetarian']
}

const mealplanData = [
    {
        mealplan: {
            user_id: 1,
            week: 1,
            meal: {
                mealId: 1591791,
                name: 'Hamburger',
                diets: ['gluten free', 'primal'],
                image: 'https://img.spoonacular.com/recipes/1591791-312x231.jpg'
            }
        }
    },
    {
        mealplan: {
            user_id: 1,
            week: 2,
            meal: {
                mealId: 1591791,
                name: 'Orange Chicken',
                diets: ['gluten free', 'primal'],
                image: 'https://img.spoonacular.com/recipes/1591791-312x231.jpg'
            }
        }
    }
];

const executeScript = async() => {
    try {
        await connect();

        await User.deleteMany({});
        await MealPlans.deleteMany({});

        const mealIds = [];
        for (const meal of mealplanData) {
            const mealplan = await MealPlans.create(meal);
            mealIds.push(mealplan.id);
        }

        userData.mealplans = mealIds;
        const user = await User.create(userData);

        const userWithMealplan = await User.findById(user.id)
            .select('-password')
            .populate('mealplans');
        console.log(JSON.stringify(userWithMealplan, null, 2));

    } catch (error) {
        console.log(error);
    } finally {
        mongoose.disconnect();
    }
};

executeScript();