import getPrismaInstance from "../utils/PrismaClient.js";

import { renameSync } from "fs";

export const addMessage = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance()
        const { message, from, to } = req.body;
        const getUser = onlineUsers.get(to)
        if (message && from && to) {
            const newMessage = await prisma.Message.create({
                data: {
                    message,
                    sender: { connect: { id: from } },
                    receiver: { connect: { id: to } },
                    messageStatus: getUser ? "delivered" : "sent"
                },
                include: { sender: true, receiver: true }
            })
            return res.status(201).send({ message: newMessage });
        }
        return res.status(400).send({ message: "From,to and  Message is required" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const getMessages = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance()
        const { from, to } = req.params;

        const messages = await prisma.Message.findMany({
            where: {
                OR: [
                    {
                        senderId: from,
                        receiverId: to
                    },
                    {
                        senderId: to,
                        receiverId: from
                    }
                ]
            },
            orderBy: {
                id: "asc"
            },
        });
        const unreadMessages = [];

        messages.forEach((message, index) => {
            if (message.messageStatus !== "read" && message.senderId === to) {
                messages[index].messageStatus = "read"
                unreadMessages.push(message.id)
            }
        });

        await prisma.message.updateMany({
            where: {
                id: { in: unreadMessages }
            },
            data: {
                messageStatus: "read"
            }
        })
        return res.status(200).send({ messages });
    } catch (error) {
        next(error)
    }
}


export const addImageMessage = async (req, res, next) => {
    try {
        if (req.file) {
            const date = Date.now()
            let fileName = "uploads/images/" + date + "-" + req.file.originalname;
            renameSync(req.file.path, fileName);
            const prisma = getPrismaInstance()
            const { from, to } = req.query;

            if (from && to) {
                const message = await prisma.Message.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: from } },
                        receiver: { connect: { id: to } },
                        type: "image",
                    }
                })
                return res.status(201).send({ message });
            }
            return res.status(400).send({ msg: "From,to and  Message is required" });
        }
        return res.status(400).send({ msg: "Image is required." });
    } catch (error) {
        next(error)
    }
}


export const addAudioMessage = async (req, res, next) => {
    try {
        if (req.file) {
            console.log(req.file);
            const date = Date.now()
            let fileName = "uploads/recordings/" + date + "-" + req.file.originalname;
            renameSync(req.file.path, fileName);
            const prisma = getPrismaInstance()
            const { from, to } = req.query;

            if (from && to) {
                const message = await prisma.Message.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: from } },
                        receiver: { connect: { id: to } },
                        type: "audio",
                    }
                })
                return res.status(201).send({ message });
            }
            return res.status(400).send({ msg: "From,to and  Message is required" });
        }
        return res.status(400).send({ msg: "Audio is required." });
    } catch (error) {
        next(error)
    }
}


export const getInitialContactsWithMessage = async (req, res, next) => {
    try {
        const userId = req.params.from
        if (!userId) {
            return res.status(400).send({ msg: "Invalid user ID" });
        }
        const prisma = getPrismaInstance()
        const user = await prisma.User.findUnique({
            where: { id: userId },
            include: {
                sentMessage: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                },
                recivedMessage: {

                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                }
            }
        })
        const message = [...user.sentMessage, ...user.recivedMessage]
        message.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        const users = new Map()
        const messageStatusChange = []

        message.forEach((msg) => {
            const isSender = msg.senderId === userId
            const calculateId = isSender ? msg.receiverId : msg.senderId
            if (msg.messageStatus === "sent") {
                messageStatusChange.push(msg.id)
            }
            const { id, type, message, messageStatus, createdAt, senderId, receiverId } = msg
            if (!users.get(calculateId)) {
                let user = {
                    messageId: id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    senderId,
                    receiverId,
                }
                if (isSender) {
                    user = {
                        ...user,
                        ...msg.receiver,
                        totalUnreadMessage: 0
                    }
                } else {
                    user = {
                        ...user,
                        ...msg.sender,
                        totalUnreadMessage: msg.messageStatus === "read" ? 1 : 0
                    }
                }
                users.set(calculateId, { ...user })
            } else if (messageStatus !== "read" && !isSender) {
                users.set(calculateId, {
                    ...user,
                    totalUnreadMessage: user.totalUnreadMessage + 1
                })
            }
        })
        if (messageStatusChange.length) {
            await prisma.message.updateMany({
                where: {
                    id: { in: messageStatusChange }
                },
                data: {
                    messageStatus: "delivered"
                }
            })
        }
        return res.status(200).send({ users: Array.from(users.values()), onlineUsers: Array.from(onlineUsers.keys()) });
    } catch (error) {
        next(error)
    }
}