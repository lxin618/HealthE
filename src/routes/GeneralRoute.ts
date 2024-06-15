import express from 'express';

const router = express.Router();

router.get('/status', (req, res) => {
    res.status(200).json('Hey, server is running!!');
});

export { router as GeneralRoute };
