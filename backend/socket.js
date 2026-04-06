import { Server } from "socket.io";
import { Message } from "./model/messagemodel.js";
import { Notification } from "./model/notificationmodel.js";

let io;
const activeUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN?.split(", ").map(o => o.trim()) || "http://localhost:5174",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("authenticate", (userId) => {
            if (!userId) return;
            activeUsers.set(userId.toString(), socket.id);
            console.log(`User ${userId.toString()} authenticated on socket ${socket.id}`);
        });

        socket.on("send_message", async (data) => {
            const { sender, senderModel, receiver, receiverModel, content, senderName } = data;

            try {
                // Save message to DB
                const newMessage = await Message.create({
                    sender,
                    senderModel,
                    receiver,
                    receiverModel,
                    content
                });

                // Create persistent notification for "missed" feed
                const notification = await Notification.create({
                    recipient: receiver,
                    recipientModel: receiverModel,
                    sender: sender,
                    senderModel: senderModel,
                    type: "new_message",
                    title: "New Message",
                    message: `${senderName || 'Someone'} sent you a message: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
                    link: "/chat"
                });

                // Emit to receiver if online
                if (receiver) {
                    const receiverSocketId = activeUsers.get(receiver.toString());
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit("receive_message", newMessage);
                        io.to(receiverSocketId).emit("new_notification", notification);
                    }
                }

                // Emit back to sender 
                socket.emit("message_sent", newMessage);

            } catch (error) {
                console.error("Socket Message Error:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            for (let [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

export const getIO = () => io;

export const sendNotification = (recipientId, notification) => {
    if (!io) return;
    const socketId = activeUsers.get(recipientId.toString());
    if (socketId) {
        io.to(socketId).emit("new_notification", notification);
    }
};
