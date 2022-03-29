const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid');

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
    
console.log(Object.values(results)[0][0]);
}
app.set('view engine','ejs');
app.use(express.static('public'))

app.get('/',(req,res) => {
    res.redirect(`/${uuidV4()}`)
    res.json('âj')
})

app.get('/:room',(req,res) => {
    res.render('room',{roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room',(roomId,userId) => {
        console.log(roomId,userId);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId)
    })
})
server.listen(3000)