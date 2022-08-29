const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
   
  });

let users = [] ;

const addUser = (userId,socketId)=>{
    !users.some(user=>user.useId === userId) &&
        users.push({userId,socketId})
}

const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId !== socketId)
}

const getUser = (userId)=>{
    return users.find((user)=>user.userId === userId)
}

io.on("connection", (socket) => {
    //when connected
    console.log("user has connected ya sheko")
    
    

    // take userId and socketId from the user
    socket.on('addUser',(userId)=>{
        addUser(userId,socket.id)
        io.emit('getUsers',users)
    })

    //send and get messages
    socket.on('sendMessage',({senderId,receiverId,text})=>{
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage",{
            senderId,text
        })
    })

    //when disconnected
    socket.on('disconnect',()=>{
        console.log("a user has been disconnected")
        removeUser(socket.id)
        io.emit('getUsers',users)
    })
})

