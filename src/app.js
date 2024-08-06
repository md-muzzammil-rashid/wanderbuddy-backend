
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import { app, server } from './socket/socket.js'
import { connectDB } from './db/index.db.js'


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(cors({
    origin:["http://localhost:3000", "http://192.168.127.81:3000", "http://192.168.127.81:8081"],
    credentials:true,
    allowedHeaders:['Content-Type','Authorization'],
    exposedHeaders:['Content-Type','Authorization'],
    methods:['GET','POST','PUT','DELETE'],
}))


import userRoutes from './routes/user.routes.js'
import tripRoute from './routes/trip.routes.js'
import invitationRoute from './routes/invitation.routes.js'
import restaurantRoute from './routes/restaurant.routes.js'
import messageRoute from './routes/message.routes.js'

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/trip', tripRoute)
app.use('/api/v1/invitation', invitationRoute)
app.use('/api/v1/restaurant', restaurantRoute)
app.use('/api/v1/message', messageRoute)


export const startServer = () => {
    connectDB().then(()=>{
        server.listen(process.env.PORT || 6010, ()=> {
            console.log("💻 Server is listening on PORT : " + process.env.PORT);
        })
    })
}