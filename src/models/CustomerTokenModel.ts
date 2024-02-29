import mongoose, { Schema, Document, Model } from "mongoose";

export interface CustomerTokenDoc extends Document {
    customerId: string
    token: string
}

const CustomerTokenSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30*86400
    }
})

export const CustomerToken = mongoose.model('CustomerToken', CustomerTokenSchema)