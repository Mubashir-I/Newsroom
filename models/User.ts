import { Schema, models, model } from 'mongoose'

const UserSchema = new Schema ({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: [true, "Email already taken, try any other..."],
        required: [true, "email is not optional"]
    },
    username: {
        type: String,
        unique: [true, "Username is already taken, try any other..."],
        required: [true, "username is not optional"]
    },
    role: {
        type: String,
        enum: ['admin', 'writer', 'reader'],
        default: 'reader'
    },
    password: {
        type: String,
        required: [true, "Passwords are no more optional in secure systems"],
        select: false
    }
}, {timestamps: true});

const User = models.User || model("User", UserSchema);
export default User;