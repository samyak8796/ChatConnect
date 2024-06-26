const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();
connectDB()


app.use(express.json());

app.get('/', (req,res)=>{
    res.send("API running fine")
})

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000
const server = app.listen(PORT, console.log(`Server running fine on Port ${PORT}`));

const io = require("socket.io")(server,{
    pingTimeout: 50000,
    cors:{
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket)=>{
    console.log("connected to socket.io");

    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("User joined room: " + room);
    });

    socket.on("typing", (room)=> socket.in(room).emit("typing"));
    socket.on("stop typing", (room)=>socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageReceived)=>{
        var chat = newMessageReceived.chat;
        if(!chat.users)
            return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id)
                return;
            socket.in(user._id).emit("message received" , newMessageReceived)
        });
    });


    socket.off("setup", ()=>{
        console.log("User Disconnected");
        socket.leave(userData._id);
    }); 
});
