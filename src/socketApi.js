const socketio=require('socket.io');
const io=socketio();

const randomColor=require('../helpers/randomColor');


const socketApi={};
socketApi.io=io;
const users ={};
io.on('connection',(socket)=>{
    socket.on("newUser",(data)=>{
        const defaultData={
            id:socket.id,
            position:{
                x:0,
                y:0
            },
            color:randomColor()

        };
        const userData=Object.assign(data,defaultData);
        users[socket.id]=userData;
        socket.broadcast.emit("newUser",users[socket.id]);
        socket.emit('initPlayers',users);
    });
    socket.on("disconnect",()=>{
        socket.broadcast.emit('disUser',users[socket.id]);
        delete users[socket.id]
    });
    socket.on("animate",(data)=>{
        try {
             users[socket.id].position.x=data.x;
        users[socket.id].position.y=data.y;
        socket.broadcast.emit("animate",{
            socketId:socket.id,
            x:data.x,
            y:data.y
        })
        } catch (error) {
            console.log(error);
            
        }
      
    })
    socket.on("msg",(data)=>{
    
        socket.broadcast.emit("msg1",data);
        
    })
});

module.exports=socketApi;