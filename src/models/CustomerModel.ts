import mongoose, { Schema, Document } from "mongoose";
import { GeneratePassword, GenerateSalt } from "../utility";

export interface CustomerDoc extends Document {
    _id: string
    firstName: string
    lastName: string
    email: string | null
    password: string
    salt: string
    gender: string
    socialSignin: string
    birthday: Date
    phone: number | null
    height: number
    weight: number
    overweight: boolean | null
    highBloodPressure: boolean | null
    smoker: boolean | null
    alcohol: boolean | null
    highCholesterol: boolean | null
    diabetes: boolean | null
    chronic: string
    accountSetUp: boolean
    ethnicity: string
    profileImage: string
    createdAt: Date
    updatedAt: Date
}

const CustomerSchema = new Schema({
    firstName: {type: String, require: true, trim: true},
    lastName: {type: String, require: true, trim: true},
    email: {type: String, unique: true, trim: true, index: true, sparse: true},
    password: {type: String, require: true},
    salt: {type: String, require: true},
    gender: {type: String},
    socialSignin: {type: String},
    birthday: {type: Date, default: null},
    ethnicity: {type: String},
    phone: {type: Number, unique: true, trim: true, index: true, sparse: true},
    profileImage: {type: String},
    height: {type: Number},
    weight: {type: Number},
    overweight: {type: Boolean, default: null},
    highBloodPressure: {type: Boolean, default: null},
    smoker: {type: Boolean, default: null},
    accountSetUp: {type: Boolean, default: false},
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

CustomerSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const salt = await GenerateSalt()
        const hashPassword = await GeneratePassword(this.get('password'), salt)
        this.set('password', hashPassword)
        this.set('salt', salt)
    }
    done()
})

export const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)