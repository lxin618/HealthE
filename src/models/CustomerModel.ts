import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDoc extends Document {
    _id: string
    name: string
    email: string
    password: string
    salt: string
    gender: string
    age: number
    phone: number
    height: number
    weight: number
    overweight: boolean | null
    highBloodPressure: boolean | null
    smoker: boolean | null
    alcohol: boolean | null
    highCholesterol: boolean | null
    diabetes: boolean | null
    chronic: string
    verified: boolean
    otp: number
    optExpiry: Date
    ethnicity: string
    profileImage: string
    createdAt: Date
    updatedAt: Date
}

const CustomerSchema = new Schema({
    name: {type: String, require: true, trim: true},
    email: {type: String, require: true, unique: true, trim: true},
    password: {type: String, require: true},
    salt: {type: String, require: true},
    verified: {type: Boolean, require: true},
    otp: {type: Number, require: true},
    optExpiry: {type: Date, require: true},
    gender: {type: String},
    age: {type: Number, unique: true},
    ethnicity: {type: String},
    phone: {type: Number},
    profileImage: {type: String},
    height: {type: Number},
    weight: {type: Number},
    overweight: {type: Boolean, default: null},
    highBloodPressure: {type: Boolean, default: null},
    smoker: {type: Boolean, default: null},
    alcohol: {type: Boolean, default: null},
    highCholesterol: {type: Boolean, default: null},
    diabetes: {type: Boolean, default: null},
    chronic: {type: String, default: null},
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.password
            delete ret.salt
            delete ret.__v
        }
    },
    timestamps: true
})

export const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)