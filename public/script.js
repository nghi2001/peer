const socket = io('/');
const peer = new Peer()
console.log(peer);
peer.on('open', function(id) {
        console.log(id);
    socket.emit('join-room',RoomID,id)
  });


const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
})
.then(stream => {
    addVideoStream(myVideo,stream)

    peer.on('call',call => {
        call.answer(stream)
    })

    socket.on('user-connected',(userid) => {
        alert(userid)
        connectToNewUser(userid,stream)
    })
    
})
function connectToNewUser(userid,stream){
    let call = peer.call(userid,stream)
    let video = document.createElement('video');
    video.classList.add('client')
    call.on('stream', userVideoStream => {
        console.log('video from recive');
        addVideoStream(video,userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
}
function addVideoStream(video,stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        video.play()
    })
    videoGrid.appendChild(video)
}