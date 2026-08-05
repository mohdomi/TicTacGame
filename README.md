# tictactoe

A real-time Tic-Tac-Toe game with a Socket.IO backend and a React + Vite frontend. Players join rooms by ID, take turns on a shared board, and chat while playing — all over WebSockets with zero server-side persistence.

## Features

- Real-time multiplayer via Socket.IO rooms
- Join existing rooms or generate random room IDs
- Turn-based play with server-side turn enforcement
- In-game chat between players
- New game reset with shared state sync
- Responsive gradient UI with Tailwind CSS
- Client-side navigation with React Router
- Zustand store for page-access control

## Stack

| Concern       | Choice                                          |
|---------------|--------------------------------------------------|
| Frontend      | React + TypeScript + Vite                        |
| Styling       | Tailwind CSS v4                                  |
| Routing       | React Router v7                                  |
| State         | Zustand                                          |
| Real-time     | Socket.IO client                                 |
| Backend       | Express + Socket.IO + TypeScript                 |
| Runtime       | Node.js                                          |
| Build         | TypeScript + Vite                                |
| Deployment    | Vercel (frontend) + Render (backend)             |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 24
- npm

### Install

```bash
# frontend
cd frontend
npm install

# backend
cd backend
npm install
```

### Configure

Copy `.env.example` to `.env` in the `frontend` directory and set the backend URL:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Run

```bash
# backend (from backend/)
npm run dev       # development with nodemon
npm run build     # production build
npm start         # production

# frontend (from frontend/)
npm run dev       # development with Vite
npm run build     # production build
npm run preview   # preview production build
```

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173` (Vite default).

## API Reference

All communication happens over Socket.IO. The client connects to the backend URL and joins a room by emitting events.

### `join_room`

Join or create a room by its 6-character ID.

**Emit:**
```js
socket.emit("join_room", "AA1111")
```

**Receive:**
```js
socket.on("joined_room_full", ({ success, reason }) => {
  // success: true  — joined the room
  // success: false — room is full
})
```

### `send_squares`

Submit the current board state after a move. The server validates turn order and broadcasts the updated state.

**Emit:**
```js
socket.emit("send_squares", ["X", null, "O", ...])
```

**Receive:**
```js
socket.on("receive_updated_squares", (data) => {
  // data: the updated squares array
})
```

### `turn_update`

Notifies clients whose turn it is after a valid move.

**Receive:**
```js
socket.on("turn_update", { turn: "socket-id" })
```

### `game_start`

Emitted when both players have joined and the game begins.

**Receive:**
```js
socket.on("game_start", { turn: "socket-id" })
```

### `send_message`

Send a chat message to the other player in the room.

**Emit:**
```js
socket.emit("send_message", { text: "Good luck!" })
```

**Receive:**
```js
socket.on("receive_message", (data) => {
  // data: { text: string }
})
```

### `refresh_game`

Reset the board to a new game state.

**Emit:**
```js
socket.emit("refresh_game", Array(9).fill(null))
```

### `error`

Received when the server rejects an action (e.g. out-of-turn move).

**Receive:**
```js
socket.on("error", "Not your turn.")
```

## Deployment

### Prerequisites (free)

- [Vercel](https://vercel.com) account (frontend)
- [Render](https://render.com) account (backend)
- Node.js >= 24

### 1. Deploy Frontend on Vercel

1. Push the `frontend/` directory to a Git repository.
2. Import the project on Vercel.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Add the environment variable `VITE_BACKEND_URL` pointing to your deployed backend URL.

### 2. Deploy Backend on Render

1. Push the `backend/` directory to a Git repository.
2. Create a new Web Service on Render.
3. Set the build command to `npm install && npm run build`.
4. Set the start command to `npm start`.
5. Set the `PORT` environment variable to the port Render assigns (or leave as `3000` for local dev).

### Environment Variables for Deployment

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Deployed backend URL (frontend) |
| `PORT` | Server port (backend, defaults to 3000) |
| `FRONTEND_URL` | Frontend origin for CORS (backend) |

## Architecture

```
Frontend (React + Vite)
  │
  │  Socket.IO connection
  │  VITE_BACKEND_URL
  │
  ▼
Backend (Express + Socket.IO)
  │
  ├─ join_room ──► room lookup / creation
  │                  ├─ 2nd player joins → game_start
  │                  └─ player 1 already waiting
  │
  ├─ send_squares ──► turn validation
  │                     ├─ valid → broadcast receive_updated_squares + turn_update
  │                     └─ invalid → error event
  │
  ├─ send_message ──► broadcast receive_message to room
  │
  └─ refresh_game ──► broadcast receive_updated_squares to room

State:
  rooms: Record<string, { players: Socket[], turn: string }>
  No persistence — all state is in-memory and lost on server restart.
```

## Project Structure

```
TicTacGame/
├── backend/
│   ├── src/
│   │   └── index.ts          Express + Socket.IO server
│   ├── dist/
│   │   └── index.js          Compiled server output
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.tsx           Route definitions
│   │   ├── main.tsx          React entry point
│   │   ├── index.css         Global styles
│   │   ├── vite-env.d.ts     Vite type declarations
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── Main.tsx      Landing page (join/generate room)
│   │   │   └── Game.tsx      Game board + chat + turn logic
│   │   ├── store/
│   │   │   └── navigationStore.ts  Zustand page-access store
│   │   └── utils/
│   │       └── Socket.ts     Socket.IO client singleton
│   ├── index.html
│   ├── vite.config.ts
│   ├── vercel.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── package.json
├── mock.md
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_BACKEND_URL` | — | Backend Socket.IO URL (e.g. `http://localhost:3000`) |
| `PORT` | `3000` | Express server port (backend only) |
| `FRONTEND_URL` | — | Frontend origin for CORS (backend only) |