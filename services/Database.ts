import mongoose, { ConnectOptions } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.DATABASE_URL as string;

const dbConnection = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('MangoDB has started')
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default dbConnection