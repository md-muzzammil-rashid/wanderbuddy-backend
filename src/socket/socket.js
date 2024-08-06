import {Server} from 'socket.io'
import {createServer} from 'http'
import express from 'express'
import { log } from 'console';

const app = express();
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }
})

const userSocketMap = {};
// On Connection

io.on('connection', (socket)=>{
    const {userId, tripId} = socket.handshake.query;
    // console.log("A user connected with socket id : "+ socket.id, );


    if(!userId || !tripId) return;

    console.log("User connected with user id : "+ userId + ", trip id : "+ tripId);
    
    // if(!userSocketMap[tripId]){
    //     userSocketMap[tripId] = [];
    // }
    userSocketMap[userId]={socketId: socket.id, tripId:"trip-"+tripId}

    console.log(userSocketMap);
    socket.join(userSocketMap[userId]?.tripId)
    const roomSize = io.sockets.adapter.rooms.get("trip-"+tripId)
    log(roomSize)
    console.log("trip id is " + tripId+ " room size is " + roomSize.size);
    
    
    
    // On Disconnection
    socket.on('disconnect', ()=>{
        console.log("User with connection id : "+ socket.id+" disconnected");
        delete userSocketMap[userId];
        console.log("trip id is " + tripId+ " room size is " + roomSize.size);
        
    })

    
    
})

export {server, io, app}