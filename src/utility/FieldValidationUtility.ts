import Joi from "joi";
import passwordComplexity from 'joi-password-complexity'
import type { Request } from "express";

export const SignupValidation = (req: Request) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label('First Name'),
        lastName: Joi.string().required().label('Last Name'),
        email: Joi.string().required().label('Email'),
        phone: Joi.number().optional().label('Phone'),
        birthday: Joi.string().required().label('Birthday'),
        password: passwordComplexity({min:6,max:30}).required().label('Password')
    })
    return schema.validate(req.body)
}

export const LoginValidation = (req: Request) => {
    const schema = Joi.object({
        type: Joi.string().required().label(req.body.type),
        value: Joi.string().required().label('Email'),
        password: passwordComplexity({min:6,max:30}).required().label('Password')
    })
    return schema.validate(req.body)
}