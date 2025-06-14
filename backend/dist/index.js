"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});
const port = 3000;
io.on('connection', (socket) => {
    console.log("a user connected. id : ", socket.id);
    socket.on("send_message", (data) => {
        console.log(data);
        io.emit('receive_message', data);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
    });
});
server.listen(port, () => {
    console.log("website live at port : ", port);
});
