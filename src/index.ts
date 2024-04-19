import { connect as _connect } from 'mongoose';
import dbConnection from './services/Database';
import app from './app';

const PORT = process.env.PORT || 8000;
const StartServer = async () => {
    await dbConnection()
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
}

StartServer();
