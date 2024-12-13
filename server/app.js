import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import mongodb from './db/connection.js';

import user from './api/routes/users.js';
import meals from './api/routes/meals.js';
import mealplans from './api/routes/mealplans.js';

const app = express();
const PORT = 8080;

const options = { exposedHeader: ['Authorization']};
app.use(cors(options));

app.use(express.json());

//handle all requests to /users route with users router.
app.use('/users', user);

//handle all requests to /meals route with meals router.
app.use('/meals', meals);

//handle all requests to /mealplans route with mealplans router.
app.use('/mealplans', mealplans);

app.listen(PORT, async() => {
    await mongodb.connect();
    console.log(`Server is running at http://localhost:${PORT}`);
})