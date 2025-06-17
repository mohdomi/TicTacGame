import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Socket } from 'socket.io';

import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.FRONTEND_URL);


const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: `${process.env.FRONTEND_URL}/*`,
        methods: ['GET', 'POST']
    }
});
const port = 3000;

type roomTypes = {
    players: Socket[];
    turn: string;
}

const rooms: Record<string, roomTypes> = {};

io.on('connection', (socket: Socket) => {

    console.log("a user connected. id : ", socket.id);

    socket.on("join_room", (roomId: string) => {

        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;

        if (roomSize >= 2) {
            socket.emit("joined_room_full", { success: false, reason: "room is full" });
        } else {

            socket.join(roomId);

            socket.on("send_message", (data) => {
                console.log(data);
                socket.to(roomId).emit('receive_message', data)
            })

            console.log(io.sockets.adapter.rooms.get(roomId)?.size)

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
                })
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



                } else {

                    socket.emit("error", "Not Authorized.");

                }
            })
        }

    })


    socket.on("disconnecting", () => {
        console.log(socket.rooms);
    })


    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
    })



})




server.listen(port, () => {
    console.log("website live at port : ", port)
})
