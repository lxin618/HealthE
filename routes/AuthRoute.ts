import express, { Request, Response, NextFunction } from "express";
import { Login, Register, TokenRefresh, Logout, Verify, ResendOtp } from "../controllers";
import { Auth } from "../middleware/Auth";

const router = express.Router();

router.post('/login', Login)
router.post('/logout', Logout)
router.post('/register', Register)
router.post('/refreshtoken', TokenRefresh)
router.post('/verify', Auth, Verify)
router.post('/resendOtp', Auth, ResendOtp)

export { router as AuthRoute }