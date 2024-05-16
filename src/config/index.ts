import * as dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL as string;
export const PORT = process.env.PORT;
export const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const CLOUDI_SECRET = process.env.CLOUDI_SECRET;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH = process.env.TWILIO_AUTH;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const EMAIL_OTP_TEMPLATE_ID = process.env.EMAIL_OTP_TEMPLATE_ID;
