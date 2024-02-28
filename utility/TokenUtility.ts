import jwt from "jsonwebtoken";
import { CustomerDoc } from "../models";
import * as dotenv from 'dotenv'
import { CustomerToken } from "../models/CustomerTokenModel";
import { Schema } from "mongoose";

dotenv.config();
const ACCESS_KEY = process.env.ACCESS_TOKEN_KEY as string
const REFRESH_KEY = process.env.ACCESS_TOKEN_KEY as string

export interface AccessTokenPayload {
    _id: string
    email: string
}

export const GenerateTokens = async (customer: CustomerDoc) => {
    try {
        const payload = {_id: customer._id, email: customer.email}
        const accessToken = jwt.sign(payload, ACCESS_KEY, {expiresIn: '2d'})
        const refreshToken = jwt.sign(payload, REFRESH_KEY, {})
        const model = await CustomerToken.findOneAndUpdate({ customerId: customer._id }, { token: refreshToken }, { upsert: true, new: true, setDefaultsOnInsert: true });
        return Promise.resolve({accessToken, refreshToken})
    }
    catch(e) {
        return Promise.reject({e})
    }
}

export const VerifyRefreshToken = async (refreshToken: string) => {
    try {
        const tokenExist = await CustomerToken.findOne({token: refreshToken})
        if (tokenExist) {
            const returndata = jwt.verify(refreshToken, REFRESH_KEY) as AccessTokenPayload
            return Promise.resolve(returndata)
        }
        else {
            return Promise.reject('no token found')
        }
     }
     catch(e) {
        return Promise.reject(e)
     }
}