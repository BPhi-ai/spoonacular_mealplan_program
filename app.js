import 'dotenv/config';
import express from 'express';

import connection from './db/connection.js';

import users from './api/routes/users.js';
import mealplans from './api/routes/mealplans.js';
import meals from './api/routes/meals.js';

const app = express();
const PORT = 9090;

app.use(express.json());

app.use('/users', users);
app.use('/mealplans', mealplans);
app.use('/meals', meals);


app.listen(PORT, async () => {
    await connection.connect();
    console.log(`Server is running on port: ${PORT}`);
})