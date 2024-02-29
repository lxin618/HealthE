import jwt from "jsonwebtoken";
import { CustomerDoc } from "../models";
import { CustomerToken } from "../models/CustomerTokenModel";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config'

export interface AccessTokenPayload {
    _id: string
    email: string
}

export const GenerateTokens = async (customer: CustomerDoc) => {
    try {
        const payload = {_id: customer._id, email: customer.email}
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, {expiresIn: '2d'})
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_KEY, {})
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
            const returndata = jwt.verify(refreshToken, REFRESH_TOKEN_KEY) as AccessTokenPayload
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