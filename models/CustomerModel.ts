import mongoose, { Schema, Document, Model } from "mongoose";

export interface CustomerDoc extends Document {
    _id: string
    name: string
    email: string
    password: string
    salt: string
    gender: string
    age: number
    phone: number
    verified: boolean
    otp: number
    opt_expiry: Date
    ethnicity: string
    profileImage: string
    createdAt: Date
    updatedAt: Date
}

const CustomerSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    salt: {type: String, require: true},
    verified: {type: Boolean, require: true},
    otp: {type: Number, require: true},
    opt_expiry: {type: Date, require: true},
    gender: {type: String},
    age: {type: Number},
    ethnicity: {type: String},
    phone: {type: Number},
    profileImage: {type: String}
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