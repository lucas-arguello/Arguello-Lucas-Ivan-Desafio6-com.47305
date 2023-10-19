import mongoose from 'mongoose';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'Usuario'],
        default: 'Usuario'
    }
    
})

export const usersModel = mongoose.model(usersCollection, userSchema);