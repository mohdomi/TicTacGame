"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.frontend_URL);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.Frontend_URL,
        methods: ['GET', 'POST']
    }
});
const port = 3000;
const rooms = {};
io.on('connection', (socket) => {
    console.log("a user connected. id : ", socket.id);
    socket.on("join_room", (roomId) => {
        var _a, _b;
        const roomSize = ((_a = io.sockets.adapter.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.size) || 0;
        if (roomSize >= 2) {
            socket.emit("joined_room_full", { success: false, reason: "room is full" });
        }
        else {
            socket.join(roomId);
            socket.on("send_message", (data) => {
                console.log(data);
                socket.to(roomId).emit('receive_message', data);
            });
            console.log((_b = io.sockets.adapter.rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.size);
            socket.emit("joined_room_full", { success: true, reason: "joined room", });
            if (!rooms[roomId]) {
                rooms[roomId] = { players: [], turn: "" };
                console.log("added players : [] and turn : '' for ", roomId);
            }
            const room = rooms[roomId];
            if (room.players.length < 2) {
                room.players.push(socket);
                socket.data.roomId = roomId;
                console.log(`Added Player ${socket.id} to players`);
            }
            if (room.players.length === 2) {
                // toh basically room.turn mei players ki id hai
                room.turn = room.players[0].id;
                io.to(roomId).emit("game_start", {
                    turn: room.turn
                });
            }
            socket.on("send_squares", (data) => {
                console.log(data);
                if (socket.rooms.has(roomId)) {
                    if (room.turn !== socket.id) {
                        socket.emit("error", "Not your turn.");
                        return;
                    }
                    socket.to(roomId).emit('receive_updated_squares', data);
                    const [player1, player2] = room.players;
                    room.turn = socket.id === player1.id ? player2.id : player1.id;
                    io.to(roomId).emit("turn_update", { turn: room.turn });
                }
                else {
                    socket.emit("error", "Not Authorized.");
                }
            });
        }
    });
    socket.on("disconnecting", () => {
        console.log(socket.rooms);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
    });
});
server.listen(port, () => {
    console.log("website live at port : ", port);
});
