import Joi from "joi";
import passwordComplexity from 'joi-password-complexity'
import type { Request } from "express";

export const SignupValidation = (req: Request) => {
    const schema = Joi.object({
        name: Joi.string().required().label('Name'),
        email: Joi.string().required().label('Email'),
        password: passwordComplexity().required().label('Password')
    })
    return schema.validate(req.body)
}