import bcrypt from "bcrypt"
import {JWTPayload, jwtVerify, SignJWT} from "jose"

export const hash = async (text: string) => {
    return await bcrypt.hash(text, 10);
}

export const equal = async (text1: string, text2: string) => {
    return await bcrypt.compare(text1, text2);
}

export const encrypt = async (payload: JWTPayload) => {
    const key = new TextEncoder().encode(process.env.SECRET_KEY);
    return await new SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(key);
}

export const decrypt = async (input: string) => {
    const key = new TextEncoder().encode(process.env.SECRET_KEY);
    try {
        return jwtVerify(input, key, {algorithms: ["HS256"]});
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return error.message;
        } else {
            return "An unexpected error occurred";
        }
    }
}


export const validatePassword = (password: string) => {
    const requirements = [
        {
            test: (password:string) => password.length >= 7,
            msg: "Minimum 7 character required."
        },
        {
            test: (password:string) => /[A-Z]/.test(password),
            msg: "Must include Uppercase letter"
        },
        {
            test: (password:string) => /[0-9]/.test(password),
            msg: "Must include a number"
        },
        {
            test: (password:string) => /[^A-Za-z0-9]/.test(password),
            msg: "Must include a special character"
        }
    ];

    for (const req of requirements) {
        if (!req.test(password)) throw new Error(req.msg);
    }

    return true;
};