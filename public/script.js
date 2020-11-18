const socket=io('/');

let name;

do{
    name=prompt("enter your name here");
}while(!name);

const videogrid=document.getElementById('video-grid');
const myvideo=document.createElement('video');
myvideo.muted=true;

console.log(myvideo);

var mypeer =new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3000'
});

let myvideostream;
const peers=[];

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myvideostream=stream;
    addvideostream(myvideo,stream);

    mypeer.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video');
         call.on('stream',uservideostream=>{
        addvideostream(video,uservideostream);
        });
    })

    socket.on('user-connected',(userid)=>{
    connecttonewuser(userid,stream);
   });

});



mypeer.on('open',id=>{
    socket.emit('join-room',roomid,id);
})

const connecttonewuser=(userid,stream)=>{
    const call=mypeer.call(userid,stream);
    const video=document.createElement('video');
    call.on('stream',uservideostream=>{
        addvideostream(video,uservideostream);
    })

   call.on('close',()=>{
       video.remove();
   })
   socket.on('user-disconnected',userid=>{
    if(peers[userid]){
        peers[userid].close();
        
    }
})
  peers[userid]=call;
}


const addvideostream=(video,stream)=>{
    video.srcObject=stream;
    video.onloadedmetadata=()=>{
        video.play();
    };

    videogrid.append(video);
}

let msg=$('input');


$('html').keydown((e)=>{

    let me=msg.val();

let message ={
    me,
    name
}

    console.log(message);
   if(e.which==13 && message["me"].length!==0){
       socket.emit('message',message);
       $('input').val('');
   }

});


   socket.on('createdmessage',message=>{
    console.log("from server"+message);
    let msgfrom = message['name'];
    let msg =message['me'];
    $('.messages').append(`<li class="message"><b>${msgfrom}</b><br>${msg}</li>`);
    scrolltobottom();
});


const scrolltobottom = () =>{
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


const muteunmute=()=>{
    const enable = myvideostream.getAudioTracks()[0].enabled;
    if(enable){
        myvideostream.getAudioTracks()[0].enabled=false;
        setunmutebutton();
    }else{
          setmutebutton();
          myvideostream.getAudioTracks()[0].enabled=true;
    }
}

const setunmutebutton=()=>{
    const html=`
       <i class="unmute fas fa-microphone-slash"></i>
       <span>unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}

const setmutebutton=()=>{
    const html=`
       <i class="fas fa-microphone"></i>
       <span>mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}

const playstop=()=>{
    const enable = myvideostream.getVideoTracks()[0].enabled;
    if(enable){
        myvideostream.getVideoTracks()[0].enabled=false;
        setplayvideo();
    }else{
          setstopvideo();
          myvideostream.getVideoTracks()[0].enabled=true;
    }
}

const setplayvideo=()=>{
    const html=`
       <i class="unmute fas fa-video-slash"></i>
       <span>play video</span>
    `
     document.querySelector('.main_video_button').innerHTML=html;
}

const setstopvideo=()=>{
    const html=`
       <i class=" fas fa-video"></i>
       <span>stop video</span>
    `
     document.querySelector('.main_video_button').innerHTML=html;
}
