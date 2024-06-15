import express from 'express';
import 'express-async-errors';
import { connect as _connect } from 'mongoose';
import * as dotenv from 'dotenv';
import { CustomerRoute, AuthRoute } from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/customer', CustomerRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/health', (req, res) => {
    res.status(200).send('server is up and running');
});

export default app;
