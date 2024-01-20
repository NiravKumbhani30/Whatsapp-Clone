import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import IndexRouter from './routes/IndexRoutes.js';
import { Server } from 'socket.io';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images", express.static("uploads/images"));

app.use("/api", IndexRouter);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    }
})

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.broadcast.emit("online-users", {
            onlineUsers: Array.from(onlineUsers.keys())
        })
    })

    socket.on("signout", (id) => {
        onlineUsers.delete(id)
        socket.broadcast.emit("online-users", {
            onlineUsers: Array.from(onlineUsers.keys())
        })
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", {
                from: data.from,
                message: data.message
            });
        }
    })

    socket.on("outgoing-voice-call", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("incoming-voice-call", {
                from: data.from,
                roomId: data.roomId,
                callType: data.callType
            });
        }
    })

    socket.on("outgoing-video-call", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("incoming-video-call", {
                from: data.from,
                roomId: data.roomId,
                callType: data.callType
            });
        }
    })

    socket.on("reject-voice-call", (data) => {
        const sendUserSocket = onlineUsers.get(data.from);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("voice-call-rejected");
        }
    })

    socket.on("reject-video-call", (data) => {
        const sendUserSocket = onlineUsers.get(data.from);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("video-call-rejected");
        }
    })

    socket.on("accept-incoming-call", ({ id }) => {
        const sendUserSocket = onlineUsers.get(id);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("accept-call");
        }
    })
})