import { Request, Response } from 'express';
import { Customer } from '../models';
import { ValidatePassowrd } from '../utility';
import { SignupValidation, LoginValidation } from '../utility/FieldValidationUtility';
import { GenerateTokens, VerifyRefreshToken } from '../utility/TokenUtility';
import jwt from 'jsonwebtoken';
import { CustomerToken } from '../models/CustomerTokenModel';
import { GenerateOtp } from '../utility/NotificationUtility';
import { ACCESS_TOKEN_KEY, SENDGRID_API_KEY, EMAIL_OTP_TEMPLATE_ID } from '../config';
import { MailService } from '@sendgrid/mail';

export const Register = async (req: Request, res: Response) => {
    const { error } = SignupValidation(req);
    if (error) {
        return res.status(400).json(error.details[0].message);
    }
    const { firstName, lastName, email, password, phone, birthday } = req.body;
    const existingCustomer = await Customer.findOne({ email: email });
    if (existingCustomer) {
        return res.status(400).json('Email address already existed');
    }
    try {
        const dateParts = birthday.split('/');
        const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        const customer = await Customer.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            // password hashing done inside model
            password: password,
            birthday: dateObject,
        });
        const { accessToken, refreshToken } = await GenerateTokens(customer);
        return res.json({ customer, accessToken, refreshToken });
    } catch (e) {
        return res.status(500).json(e);
    }
};

export const SendOtp = async (req: Request, res: Response) => {
    const { value, type } = req.body;
    if (type == 'phone') {
        const { otp, expiry } = GenerateOtp();
        // await onRequestOtp(otp, value)
        return res.status(200).json({
            otp,
            expiry,
        });
    }
    // email
    else if (type == 'email') {
        const { otp, expiry } = GenerateOtp();
        const sendgridClient = new MailService();
        sendgridClient.setApiKey(SENDGRID_API_KEY);
        const email = {
            to: value,
            from: {
                email: 'lxin618@aucklanduni.ac.nz',
                name: 'HealthE',
            },
            personalizations: [
                {
                    to: [
                        {
                            email: value,
                        },
                    ],
                    dynamic_template_data: {
                        code: otp,
                    },
                },
            ],
            templateId: EMAIL_OTP_TEMPLATE_ID,
        };
        sendgridClient
            .send(email)
            .then(() => {
                return res.status(200).json({
                    otp,
                    expiry,
                });
            })
            .catch(() => {
                return res
                    .status(500)
                    .json('Something wrong sending the email, please try again later');
            });
    }
};

// export const Verify = async (req: Request, res: Response) => {
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

export const Logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await CustomerToken.findOneAndDelete({ token: refreshToken });
    return res.json('User logged out sccessfully');
};

export const Login = async (req: Request, res: Response) => {
    const { error } = LoginValidation(req);

    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    try {
        const { type, value, password } = req.body;
        let key: string;
        if (type == 'phone') {
            key = 'phone';
        } else {
            key = 'email';
        }
        const customer = await Customer.findOne({ [key]: value });
        if (!customer) {
            return res
                .status(404)
                .json("Can't find a customer with the email address or phone number");
        }

        if (!customer.salt) {
            return res
                .status(400)
                .json(
                    'There is no password set for this account, please reset your password or use social sign in'
                );
        }

        const validated = await ValidatePassowrd(customer.password, password, customer?.salt);

        if (validated) {
            const { accessToken, refreshToken } = await GenerateTokens(customer);
            return res.json({ customer, accessToken, refreshToken });
        } else {
            return res.status(400).json(`Incorrect password`);
        }
    } catch (e) {
        return res.status(404).json({
            error: true,
            response: `Can't find a customer with the email address - ${e}`,
        });
    }
};

export const GetCustomerById = async (req: Request, res: Response) => {
    const customerId = req.params.id;
    if (!customerId) {
        return res.status(400).json({
            error: true,
            response: 'Please provide a customer id',
        });
    }
    try {
        const customer = await Customer.findById(customerId);
        return res.json({
            error: false,
            response: customer,
        });
    } catch (e) {
        return res.status(404).json({
            error: true,
            response: `Customer with id ${customerId} can not be found - ${e}`,
        });
    }
};

export const TokenRefresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(404).json({
            error: true,
            response: 'Please provide a refresh token',
        });
    }
    try {
        const response = await VerifyRefreshToken(refreshToken);
        const payload = { _id: response._id as string, email: response.email };
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, { expiresIn: '10d' });
        return res.json({
            error: false,
            response: accessToken,
        });
    } catch (e) {
        return res.status(400).json({
            error: true,
            response: e,
        });
    }
};

export const GetCustomerProfile = async () => {};

export const CustomerAccountSetup = async (req: Request, res: Response) => {
    const customer = req.customer;
    if (!customer) {
        return res.status(404).json("Can't locate the customer");
    }
    const profile = await Customer.findById(customer._id);
    if (profile) {
        try {
            const {
                highCholesterol,
                diabetes,
                historicalFamilyDiseases,
                highBloodPressure,
                overweight,
                smoke,
                alcohol,
                ethnicity,
                height,
                weight,
                gender,
            } = req.body;
            console.log(req.body);
            profile.highCholesterol = highCholesterol;
            profile.diabetes = diabetes;
            profile.chronic = historicalFamilyDiseases;
            profile.highBloodPressure = highBloodPressure;
            profile.overweight = overweight;
            profile.smoker = smoke;
            profile.alcohol = alcohol;
            profile.ethnicity = ethnicity;
            profile.height = height;
            profile.weight = weight;
            profile.gender = gender;
            profile.accountSetUp = true;
            await profile.save();
            return res.status(200).json('Profile updated successfully');
        } catch (e) {
            return res.status(400).json('Error updating customer profile');
        }
    } else {
        return res.status(404).json('Error locating customer profile');
    }
};

export const GooglePostLogin = async (req: Request, res: Response) => {
    const { email, firstName, lastName, photoURL, phoneNumber } = req.body;

    if (!email) {
        return res.status(404).json('Error fetching email address, please try again later');
    }

    try {
        // save/update customer profile
        const customer = await Customer.findOneAndUpdate(
            { email: email },
            {
                firstName,
                lastName,
                profileImage: photoURL,
                phone: phoneNumber,
                socialSignin: 'google',
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        // once profile is saved, issue an app token
        if (customer) {
            const { accessToken, refreshToken } = await GenerateTokens(customer);
            return res.json({ customer, accessToken, refreshToken });
        } else {
            return res.status(404).json('Error saving customer profile, please try again later');
        }
    } catch (e) {
        return res.status(400).json('Error saving customer profile, please try again later');
    }
};
