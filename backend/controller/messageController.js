import { User } from "../model/usermodel.js";
import { Vendor } from "../model/vendormodel.js";
import { Message } from "../model/messagemodel.js";

// Fetch chat history between two users (customer and vendor)
export const getMessages = async (req, res) => {
    try {
        const { otherId } = req.params;
        const myId = req.user?._id || req.vendor?._id;

        if (!myId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: otherId },
                { sender: otherId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Fetch all "threads" (conversations) for a user
export const getChatThreads = async (req, res) => {
    try {
        const myId = req.user?._id || req.vendor?._id;
        
        const threads = await Message.aggregate([
            { 
                $match: { 
                    $or: [
                        { sender: myId },
                        { receiver: myId }
                    ]
                } 
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", myId] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $first: "$content" },
                    lastTime: { $first: "$createdAt" },
                    otherModel: { 
                        $first: {
                            $cond: [
                                { $eq: ["$sender", myId] },
                                "$receiverModel",
                                "$senderModel"
                            ]
                        }
                    }
                }
            }
        ]);

        // Populate other person's details
        const populatedThreads = await Promise.all(threads.map(async (t) => {
            let other;
            if (t.otherModel === 'User') {
                other = await User.findById(t._id).select("FullName");
            } else {
                other = await Vendor.findById(t._id).select("BusinessName FullName");
            }

            return {
                ...t,
                name: other?.BusinessName || other?.FullName || "User",
            };
        }));

        res.status(200).json({
            success: true,
            threads: populatedThreads
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
