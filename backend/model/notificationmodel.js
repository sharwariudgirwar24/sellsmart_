import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'recipientModel'
    },
    recipientModel: {
        type: String,
        required: true,
        enum: ['User', 'Vendor']
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        enum: ['User', 'Vendor', 'System'],
        default: 'System'
    },
    type: {
        type: String,
        required: true,
        enum: ['product_status', 'new_message', 'order_alert', 'system_alert', 'promotion']
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Notification = mongoose.model("Notification", notificationSchema);
