"use server";

import { DatabaseConnection } from "@/lib/Database";
import {hash, validatePassword} from "@/lib/Security";
import User from "@/models/User";

const registerUser = async (formdata: FormData) => {
    try {
        await DatabaseConnection();

        const email = formdata.get("email") as string;
        const username = formdata.get("username") as string;
        const password = formdata.get("password") as string;

        if(!password) {
            throw new Error ("Passwords are no more optional in secure systems");
        }
        else {
            try {
                validatePassword(password);
            }
            catch (error: unknown) {
                if (error instanceof Error) {
                    return error.message;
                } else {
                    return "An unexpected error occurred";
                }
            }
        }
        const hashedPassword = await hash(password);

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
        });

        await newUser.save();
        return {success: "User created successfully!"};
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return error.message;
        } else {
            return "An unexpected error occurred";
        }
    }
}

export default registerUser;