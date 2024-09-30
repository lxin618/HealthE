import express from 'express';
import { Login, Register, TokenRefresh, Logout, SendOtp, GooglePostLogin } from '../controllers';

const router = express.Router();

router.post('/login', Login);
router.post('/logout', Logout);
router.post('/google', GooglePostLogin);
router.post('/register', Register);
router.post('/tokenRefresh', TokenRefresh);
// router.post('/verify', Auth, Verify)
router.post('/sendOtp', SendOtp);

export { router as AuthRoute };
