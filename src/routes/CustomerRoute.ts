import express, { Request, Response, NextFunction } from "express";
import { GetCustomerById, GetCustomerProfile, Login, Register, UpdateCustomerProfile } from "../controllers";
import { Auth } from "../middleware/Auth";

const router = express.Router();

// router.post('/refreshtoken, TokenRefresh')
router.get('/profile', GetCustomerProfile)
router.get('/:id', GetCustomerById)
router.patch('/profile', UpdateCustomerProfile)

export { router as CustomerRoute }