import twilio from 'twilio'
import * as dotenv from 'dotenv'

dotenv.config();
const TWILIO_ACCOUNT_SID = process.env.ACCESS_TOKEN_KEY as string
const TWILIO_AUTH = process.env.ACCESS_TOKEN_KEY as string

export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    return {
        otp,
        expiry
    }
}

export const onRequestOtp = async (otp: number, toNumber: string) => {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH)
    const response = await client.messages.create({
        body: `Your verification code is ${otp}`,
        from: '+17812425229',
        to: toNumber
    })
    return response
}