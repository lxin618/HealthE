import express from 'express';
import 'express-async-errors';
import { connect as _connect } from 'mongoose';
import * as dotenv from 'dotenv';
import { CustomerRoute, AuthRoute } from './routes';
import dbConnection from './services/Database';

dotenv.config();
const PORT = process.env.PORT || 8000;

const StartServer = async () => {

    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api/customer', CustomerRoute)
    app.use('/api/auth', AuthRoute)

    await dbConnection()

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
}

StartServer();
