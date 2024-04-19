import { Request, Response, NextFunction } from "express";
import { Customer } from "../models";
import { ValidatePassowrd } from "../utility";
import { SignupValidation, LoginValidation } from "../utility/FieldValidationUtility";
import { GenerateTokens, VerifyRefreshToken } from "../utility/TokenUtility";
import jwt from "jsonwebtoken";
import { CustomerToken } from "../models/CustomerTokenModel";
import { GenerateOtp, onRequestOtp } from "../utility/NotificationUtility";
import { ACCESS_TOKEN_KEY } from '../config'

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = SignupValidation(req)
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    const { firstName, lastName, email, password, birthday } = req.body;
    const existingCustomer = await Customer.findOne({email: email})
    if (existingCustomer) {
        return res.status(400).json('Email address already existed')
    }
    try {
        let dateParts = birthday.split("/");
        let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
        const customer = await Customer.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            // password hashing done inside model
            password: password,
            birthday: dateObject,
        })
        const { accessToken, refreshToken } = await GenerateTokens(customer)
        return res.json({customer, accessToken, refreshToken})
    }
    catch(e) {
        return res.status(500).json(e)
    }
}

export const SendOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { value, type } = req.body
    if (type == 'phone') {
        const {otp, expiry} = GenerateOtp()
        // await onRequestOtp(otp, value)
        return res.status(200).json({
            otp,
            expiry
        })
    }
    // email
    else if (type == 'email') {
        const {otp, expiry} = GenerateOtp()

        // to do - email uses different logic to send
        // prob sendGrid? atm, return code from console for local dev

        return res.status(200).json({
            otp,
            expiry
        })
    }
    return res.status(400).json('Please provide a phone number')
}

// export const Verify = async (req: Request, res: Response, next: NextFunction) => {
//     const {otp} = req.body
//     const customer = req.customer
//     if (customer) {
//         const profile = await Customer.findById(customer._id)
//         if (profile) {
//             if (profile.otp == parseInt(otp) && profile.optExpiry <= new Date()) {
//                 profile.verified = true
//                 await profile.save()
//                 return res.json({
//                     'error': false,
//                     'response': 'verified'
//                 })
//             }
//         }
//     }
//     return res.json({
//         'error': true,
//         'response': 'verification code doesn\'t match'
//     })
// }

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
        return res.status(400).json(error.details[0].message)
    }

    try {
        const { type, value, password } = req.body;
        let key: string
        if (type == 'phone') {
            key = 'phone'
        }
        else {
            key = 'email'
        }
        const customer = await Customer.findOne({[key]: value})

        if (!customer) {
            return res.status(404).json('Can\'t find a customer with the email address or phone number')
        }

        if (!customer.salt) {
            return res.status(400).json('There is no password set for this account, please reset your password or use social sign in')
        }

        const validated = await ValidatePassowrd(customer.password, password, customer?.salt)

        if (validated) {
            const { accessToken, refreshToken } = await GenerateTokens(customer)
            return res.json({customer,accessToken,refreshToken})
        }
        else {
            return res.status(400).json(`Incorrect password`)
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
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, {expiresIn: '10d'})
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
    const customer = req.customer
    if (!customer) {
        return res.status(404).json('Can\'t locate the customer')
    }

    try {
        // const {}
    }
    catch(e) {

    }
}

export const GooglePostLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, firstName, lastName, photoURL, phoneNumber } = req.body

    if (!email) {
        return res.status(404).json('Error fetching email address, please try again later')
    }

    try {
        // save/update customer profile
        const customer = await Customer.findOneAndUpdate({ email: email }, {
            firstName,
            lastName,
            profileImage: photoURL,
            phone: phoneNumber,
            socialSignin: 'google'
        }, { 
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });

        // once profile is saved, issue an app token
        if (customer) {
            const { accessToken, refreshToken } = await GenerateTokens(customer)
                return res.json({customer,accessToken,refreshToken})
        }
        else {
            return res.status(404).json('Error saving customer profile, please try again later')
        }
    }
    catch(e) {
        return res.status(400).json('Error saving customer profile, please try again later')
    }

}