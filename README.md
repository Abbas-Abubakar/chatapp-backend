# ChatApp Backend

REST API and real-time server for a one-to-one chat app. Handles authentication, user listing, message storage, and live delivery, online status and last seen over WebSockets.

## Features

- Signup, login and logout with JWT stored in an `httpOnly` cookie
- Passwords hashed with bcrypt
- Protected routes via auth middleware
- One-to-one conversations and message history (MongoDB)
- Real-time messaging with Socket.io
- Live online users list
- Persistent **last seen** timestamp, saved when a user's last connection closes

## Tech stack

Node.js, Express, MongoDB with Mongoose, Socket.io, jsonwebtoken, bcryptjs, cookie-parser, cors, dotenv

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)

### Install

```bash
git clone https://github.com/Abbas-Abubakar/chatapp-backend.git
cd chatapp-backend
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_DB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=replace-with-a-long-random-string
NODE_ENV=development
```

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (defaults to 5000) |
| `MONGO_DB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `NODE_ENV` | Set to `development` locally. Any other value makes the auth cookie `secure` (HTTPS only) |

Never commit `.env`. It is listed in `.gitignore`.

### Run

```bash
npm run dev    # or: node server.js
```

The server starts on `http://localhost:5000`. Adjust the command to match the scripts in your `package.json`.

## API

All routes except signup and login require the `jwt` cookie.

### Auth

| Method | Route | Body | Description |
| --- | --- | --- | --- |
| POST | `/auth/signup` | `fullname, username, password, confirmPassword, gender` | Create an account and log in |
| POST | `/auth/login` | `username, password` | Log in |
| POST | `/auth/logout` | none | Clear the auth cookie |

### Users

| Method | Route | Description |
| --- | --- | --- |
| GET | `/users` | All users except the logged-in one (password excluded), including `lastSeen` |

### Messages

| Method | Route | Body | Description |
| --- | --- | --- | --- |
| GET | `/message/:id` | none | Messages between you and user `:id` |
| POST | `/message/send/:id` | `message` | Send a message to user `:id` |

## Socket.io events

The client connects with `?userId=<id>` in the handshake query.

| Event | Direction | Payload | Description |
| --- | --- | --- | --- |
| `getOnlineUsers` | server to clients | `string[]` of user ids | Sent whenever someone connects or disconnects |
| `newMessage` | server to receiver | message object | Sent when a message is saved |
| `userLastSeen` | server to clients | `{ userId, lastSeen }` | Sent when a user's last connection closes |

## Project structure

```
├── controllers/     auth, user and message logic
├── db/              MongoDB connection
├── middleware/      protectRoute (JWT check)
├── model/           User, Message, Conversation schemas
├── routes/          auth, user and message routes
├── socket/          Socket.io server and online users map
├── utils/           generateToken (JWT + cookie)
└── server.js        app entry point
```

## Deployment notes

- CORS and Socket.io currently allow only `http://localhost:5173`. Move this origin into an environment variable before deploying.
- Cross-site cookies need `sameSite` and `secure` settings that match your hosting setup.
- Online status is held in memory, so running multiple server instances needs a shared adapter such as the Socket.io Redis adapter.
