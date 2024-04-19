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
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

export const CustomerToken = mongoose.model('CustomerToken', CustomerTokenSchema)