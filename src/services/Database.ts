import mongoose, { ConnectOptions } from 'mongoose';
import { DATABASE_URL } from '../config'

const dbConnection = async () => {
    try {
        await mongoose.connect(DATABASE_URL)
        console.log('MangoDB has started')
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default dbConnection