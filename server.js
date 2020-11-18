const express=require("express");
const app=express();
const {v4:uuidv4}=require('uuid');
const server=require('http').Server(app);
const io=require("socket.io")(server);
const { ExpressPeerServer }=require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
});

const port = process.env.PORT|| 3030;

//template engine
app.set('view engine','ejs');
app.use(express.static('public'));

app.use('/peerjs',peerServer);

app.get('/',(req,res)=>{
   res.redirect(`/${uuidv4()}`);
});

app.get('/:room',(req,res)=>{
    res.render('room',{
    roomid:req.params.room
    });
});

io.on('connection',socket=>{
    socket.on('join-room',(roomid,userid)=>{
        socket.join(roomid);
        socket.to(roomid).broadcast.emit('user-connected',userid);

        socket.on('message',message=>{
            io.to(roomid).emit('createdmessage',message);
        })

        socket.on('disconnect',()=>{
             socket.to(roomid).broadcast.emit('user-disconnected',userid);
        })
    })
})

server.listen(port,()=>{
    console.log(`server running on ${port}`);
});

