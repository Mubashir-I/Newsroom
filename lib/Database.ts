import mongoose, { Mongoose } from "mongoose"


interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}
const cachedConn = global.mongoose || { conn: null, promise: null };
if (process.env.NODE_ENV !== 'production') global.mongoose = cachedConn;

export const DatabaseConnection = async () => {
    const URL = process.env.MONGODB_URI || process.env.DB_URL || process.env.MONGODB_URL;

    if (!URL) {
        throw new Error("Database URL not found. Tested: MONGODB_URI, DB_URL, MONGODB_URL. Please set one in Vercel Settings > Environment Variables.");
    }

    if (cachedConn.conn) {
        return cachedConn.conn;
    }

    if (!cachedConn.promise) {
        const opts = {
            bufferCommands: false,
        };
        cachedConn.promise = mongoose.connect(URL, opts).then((m) => {
            return m;
        });
    }

    try {
        cachedConn.conn = await cachedConn.promise;
    }
    catch (error) {
        cachedConn.promise = null;
        throw error;
    }
    return cachedConn.conn;
}

