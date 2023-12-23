import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import Sequelize from 'sequelize';
import { initWebRoutes } from './routes/web';
import http from 'http';
import socketIo from 'socket.io';
import db from './models';

const User = db.User;
dotenv.config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/./config/config.json')[env];

let app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  }),
);

initWebRoutes(app);

let port = process.env.PORT || 8080;

const server = http.createServer(app);

export const io = socketIo(server);

// Set the maximum number of listeners to 15 for the 'deleteUser' event
io.setMaxListeners(15);

// handle socket connection

io.on('connection', (socket) => {
  // console.log(`Socket connected: ${socket.id}`);

  socket.on('deleteUser', (userId) => {
    socket.broadcast.emit('logoutUser', userId);
  });

  socket.on('checkAvailableUser', async (userEmail) => {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) socket.broadcast.emit('forceLogout', userEmail);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// connect to database
const sequelize = new Sequelize(config.database, config.username, config.password, config);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log('_____________________________________');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
