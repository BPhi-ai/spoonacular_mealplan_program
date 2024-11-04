import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    mealplans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealPlans'}],
    preferences: [String]
});

const User = mongoose.model('User', UserSchema);

export default User;