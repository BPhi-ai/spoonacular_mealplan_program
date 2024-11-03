import express from 'express';
import { Users, MealPlans } from '../../db/mocks.js';

const router = express.Router();

// POST /mealplans
router.post('/', async (req, res) => {
    try {
      const user_id = Number(req.headers.user_id);
      const { week, mealId, name, diets, image } = req.body;

      //checking to see if the user is found.
      const user = Users.find('_id', user_id);
      if(!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      /*if-else branch to determine if the mealplan has been created already, if not, it will create a new mealplan.
      * Otherwise, if there is more than 3 meals per week, it will throw an error.
      */
      if(MealPlans.find(user_id, week) === undefined) {
        MealPlans.add({
          user_id: user_id,
          week: week,
          meal: {
            mealId: mealId,
            name: name,
            diets: diets,
            image: image
          }
        });
      } else {
        if(MealPlans.find(user_id, week).meals.length >= 3) {
          return res.status(404).json({ error: 'too many meals in one week!' });
        } else {
          MealPlans.find(user_id, week). meals.push({
            mealId: mealId,
            name: name,
            diets: diets,
            image: image
          });
        }
      }
      res.json({ user: user.username, mealplans: MealPlans.find(user_id, week)});
    } catch (error) {
        return res.status(500).json({ error: error.toString()});
    }
})


// DELETE /mealplans/:id
router.delete('/:id', async (req, res) => {
  try {
      const user_id = Number(req.headers.user_id);
      const id = Number(req.params.id);

      // verify there is a requesting user (user_id)
      if (!user_id) {
          return res.status(403).json({ error: 'Forbidden user' });
      }

      const _id = MealPlans.delete(id);
      console.log(_id);
      res.json({ _id, message: 'Delete success' });
  } catch (error) {
      res.status(500).json({ error: error.toString() });
  }
});

export default router;