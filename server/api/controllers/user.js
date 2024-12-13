import User from "../models/user.js";

import { hash, compare, signToken } from "../util/auth.js";

// POST /users/register
const registerUser = async (req, res) => {
    try {
        const { username, password, preferences = [] } = req.body;

        if(!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password.'});
        }

        const hashedPassword = await hash(password);

        const userEntry = await User.create({
            username,
            password: hashedPassword,
            preferences
        });

        res.json({
            id: userEntry.id,
            username: userEntry.username,
            preferences: userEntry.preferences
        });
    } catch (error) {
        res.status(500).json({ error: error.toString()});
    }
}

// POST /users/login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password.'});  
        }

        const userEntry = await User.findOne({ username: username.toLowerCase() });
        if(!userEntry) {
            return res.status(401).json({ error: 'Invalid username or password!' });
        }

        const passwordEqual = await compare(password, userEntry.password);
        if(!passwordEqual) {
            return res.status(401).json({ error: 'Invalid username or password!' });
        }

        const token = signToken(userEntry.username, userEntry.id);

        res.json({
            id: userEntry.id,
            username: userEntry.username,
            preferences: userEntry.preferences,
            token_type: 'Bearer',
            access_token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

//GET /users/:id
const getUser = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { id } = req.params;

        if(id !== user_id) {
            return res.status(403).json({ error: 'Forbidden: You are not this user.' });
        }

        const userWithMealplan = await User.findById(id)
            .select('-password').populate('mealplans');
        
        res.json(userWithMealplan);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

// PUT /users/:id
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.headers;
        const { preferences } = req.body;

        if(id !== user_id) {
            return res.status(403).json({ error: 'Forbidden: You are not this user.' });
        }

        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const updatedUser = await User.findByIdAndUpdate({_id: id}, {preferences: preferences}, {new: true}).select('-password');
        res.json(updatedUser);

    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

export { registerUser, loginUser, getUser, updateUser };