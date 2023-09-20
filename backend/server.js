const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

app.get("/",(req,res)=>{
    res.send("this is realtime board sharing app");
});

let roomIdGlobal,imgURLGlobal;

io.on("connection",(socket) => {
    socket.on("userJoined",(data)=>{
        try {
            const{name,userId,roomId,host,presenter} = data;
        roomIdGlobal=roomId
        socket.join(roomId);
        socket.emit("userIsJoined", {success: true });
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
            imgURL: imgURLGlobal,
        });
        } catch (error) {
            console.log(error)
        }
        
    });


    socket.on("whiteboardData",(data) =>  {
        try {
            imgURLGlobal = data;
         console.log("img send success")
         socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{
            imgURL: data,
    });
        } catch (error) {
            console.log("image sending error " + error)
        }
         
});

});




const port = process.env.PORT || 5001;
server.listen(port,()=> 
    console.log("server is running at http://localhost:5001")
    );