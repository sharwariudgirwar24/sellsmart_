import { Notification } from "../model/notificationmodel.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import { sendNotification as emitRealTimeNotification } from "../socket.js";

// Helper for other controllers to create notifications
export const createNotification = async (data) => {
    try {
        const notification = await Notification.create(data);
        emitRealTimeNotification(data.recipient, notification);
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

// Get all notifications for current user/vendor
export const getMyNotifications = catchAsyncErrors(async (req, res, next) => {
    const recipientId = req.user?._id || req.vendor?._id;
    const recipientModel = req.user ? "User" : "Vendor";

    const notifications = await Notification.find({
        recipient: recipientId,
        recipientModel
    }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
        success: true,
        notifications
    });
});

// Mark notification as read
export const markAsRead = catchAsyncErrors(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
        success: true,
        message: "Notification marked as read"
    });
});

// Mark all notifications as read
export const markAllAsRead = catchAsyncErrors(async (req, res, next) => {
    const recipientId = req.user?._id || req.vendor?._id;
    const recipientModel = req.user ? "User" : "Vendor";

    await Notification.updateMany(
        { recipient: recipientId, recipientModel, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: "All notifications marked as read"
    });
});

// Delete a notification
export const deleteNotification = catchAsyncErrors(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
    }

    await notification.deleteOne();

    res.status(200).json({
        success: true,
        message: "Notification deleted"
    });
});
