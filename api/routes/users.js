import express from 'express';
import { MealPlans, Users } from '../../db/mocks.js';

const router = express.Router();

// POST /users/register
router.post('/register', async (req, res) => {
    try {
      //request body for username, password and preferences (optional)
      const {username, password, preferences = []} = req.body;

      //if the username or password is not filled.
      if (!username || !password) {
        return res.status(422).json({ error: 'Must provide both username and password.' });
      }

      //seeing if the username is already taken
      const isRegistered = Users.find('username', username);
      if(isRegistered) {
        return res.status(409).json({ error: 'Username already registered.' });
      }

      //registering the account
      const user = Users.add({
        username: username.toLowerCase(),
        password,
        preferences
      });

      res.json({username: user.username, preferences: user.preferences});

    } catch (error) {
        return res.status(500).json ({error: error.toString()});
    }
});


// POST /users/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        //if the username or password is not filled in
        if(!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password.' });
        }

        //if the username or password matches with the username/password in database.
        const user = Users.find('username', username.toLowerCase());
        if(!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password!' });
        }

        res.json({username: user.username, preferences: user.preferences});
    } catch (error) {
        return res.status(500).json ({error: error.toString()});
    }
});


// GET /users/:id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user_id = Number(req.headers.user_id);

        //checking to see if the user is allowed to see the info.
        if(id !== user_id) {
            return res.status(403).json({ error: 'Forbidden user.' });
        }

        //checking to see if the user is found or not.
        const user = Users.find('_id', id);
        if(!user) {
            return res.status(404).json({ error: 'User not found'});
        }

        //generating all of the mealplans for this particular user.
        const mealplan = MealPlans.findAll(user_id);
        
        res.json({ user: user.username, preferences: user.preferences, mealplans });
    } catch (error) {
        return res.status(500).json ({error: error.toString()});
    }
});


// PUT /users/:id
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.headers;
      const { preferences } = req.body;

      if(id !== user_id) {
        return res.status(403).json({ error: 'Forbidden user.' });
      }

      const user = Users.find('_id', parseInt(id));
      if(!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      //generating all of the mealplans and preferences for this user.
      const mealplan = MealPlans.findAll(user_id);

      const updatePref = Users.update(user._id, preferences);

      res.json({ user: user.username, mealplan, preferences: updatePref.preferences});
    } catch (error) {
        return res.status(500).json ({error: error.toString()});
    }
});

export default router;