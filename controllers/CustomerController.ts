import { Request, Response, NextFunction } from "express";
import { Customer } from "../models";
import { GeneratePassword, GenerateSalt, ValidatePassowrd } from "../utility";
import { SignupValidation, LoginValidation } from "../utility/FieldValidationUtility";
import { GenerateTokens, VerifyRefreshToken } from "../utility/TokenUtility";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
import { CustomerToken } from "../models/CustomerTokenModel";
import { GenerateOtp, onRequestOtp } from "../utility/NotificationUtility";

dotenv.config();
const ACCESS_KEY = process.env.ACCESS_TOKEN_KEY as string

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = SignupValidation(req) 
    if (error) {
        return res.status(400).json({
            'error': true,
            'response': error.details[0].message
        })
    }
    const { name, email, password, gender, phone } = req.body;
    const existingCustomer = await Customer.findOne({email: email})
    if (existingCustomer) {
        return res.status(500).json({
            'error': true,
            'response': 'Email address already existed'
        })
    }
    const salt = await GenerateSalt()
    const hashPassword = await GeneratePassword(password, salt)
    const { otp, expiry } = GenerateOtp()
    try {
        const customer = await Customer.create({
            name: name,
            email: email,
            password: hashPassword,
            salt: salt,
            gender: gender,
            otp: otp,
            opt_expiry: expiry,
            verified: false,
        })
        const { accessToken, refreshToken } = await GenerateTokens(customer)

        if (phone) {
            await onRequestOtp(otp, phone)
        }

        return res.json({
            'error': false,
            'response': {customer, accessToken, refreshToken}
        })
    }
    catch(e) {
        return res.status(500).json({
            'error': true,
            'response': e
        })
    }
}

export const ResendOtp = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.customer
    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            const {otp, expiry} = GenerateOtp()
            await onRequestOtp(otp, profile.phone.toString())
            return res.status(200).json()
        }
    }
    return res.status(400).json()
}

export const Verify = async (req: Request, res: Response, next: NextFunction) => {
    const {otp} = req.body
    const customer = req.customer
    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            if (profile.otp == parseInt(otp) && profile.opt_expiry <= new Date()) {
                profile.verified = true
                await profile.save()
                return res.json({
                    'error': false,
                    'response': 'verified'
                })
            }
        }
    }
    return res.json({
        'error': true,
        'response': 'verification code doesn\'t match'
    })
}

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body
    await CustomerToken.findOneAndDelete({token: refreshToken})
    return res.json({
        'error': false,
        'response': 'User logged out sccessfully'
    })
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = LoginValidation(req) 
    if (error) {
        return res.status(400).json({
            'error': true,
            'response': error.details[0].message
        })
    }
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({email: email})
        if (customer) {
            const validated = await ValidatePassowrd(customer.password, password, customer?.salt)
            if (validated) {
                const { accessToken, refreshToken } = await GenerateTokens(customer)
                return res.json({
                    'error': false,
                    'response': {customer,accessToken,refreshToken}
                })
            }
            else {
                return res.status(400).json({
                    'error': true,
                    'response': `Incorrect password`
                })
            }
        }
    }
    catch(e) {
        return res.status(404).json({
            'error': true,
            'response': `Can't find a customer with the email address - ${e}`
        })
    }
}

export const GetCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.params.id
    if (!customerId) {
        return res.status(400).json({
            'error': true,
            'response': 'Please provide a customer id'
        })
    }
    try {
        const customer = await Customer.findById(customerId);
        return res.json({
            'error': false,
            'response': customer
        })
    }
    catch(e) {
        return res.status(404).json({
            'error': true,
            'response': `Customer with id ${customerId} can not be found - ${e}`
        })
    }
}

export const TokenRefresh = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(404).json({
            'error': true,
            'response': 'Please provide a refresh token'
        })
    }
    try {
        const response = await VerifyRefreshToken(refreshToken)
        const payload = {_id: response._id as string, email: response.email}
        const accessToken = jwt.sign(payload, ACCESS_KEY, {expiresIn: '10d'})
        return res.json({
            'error': false,
            'response': accessToken
        })
    }
    catch(e) {
        return res.status(400).json({
            'error': true,
            'response': e
        })
    }
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const test = await VerifyRefreshToken('1eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNiMjQ2NWNhZDkwNjY5NDZiZDNiMWMiLCJlbWFpbCI6IjEyMzEyMzExMTEiLCJpYXQiOjE3MDc4MTI1MTN9.RLzB0gC12I2Uhrh8WuMTxLGbq6DTSjllR6B1IX7iL7w')
        console.log(test)
    }
    catch(e) {
        console.log(e)

    }
}

export const UpdateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    
}