import { Server } from "socket.io";
import { Message } from "./model/messagemodel.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN?.split(", ").map(o => o.trim()) || "http://localhost:5174",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const activeUsers = new Map(); // userId -> socketId

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("authenticate", (userId) => {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} authenticated on socket ${socket.id}`);
        });

        socket.on("send_message", async (data) => {
            const { sender, senderModel, receiver, receiverModel, content } = data;

            try {
                // Save message to DB
                const newMessage = await Message.create({
                    sender,
                    senderModel,
                    receiver,
                    receiverModel,
                    content
                });

                // Emit to receiver if online
                const receiverSocketId = activeUsers.get(receiver);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", newMessage);
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
