import mongoose, {Mongoose} from "mongoose"

const URL = process.env.DB_URL;

if(!URL) {
    throw new Error ("Database URL not found or empty");
}

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}
const cachedConn = global.mongoose || {conn: null, promise: null};

export const DatabaseConnection = async () => {
    if(cachedConn.conn) {
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
    catch(error) {
        cachedConn.promise = null;
        throw error;
    }
    return cachedConn.conn;
}

