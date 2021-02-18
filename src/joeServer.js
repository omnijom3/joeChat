const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
    // serve the index.html file
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.end(content);
});
const qestions = []
const io = require('socket.io')(httpServer);
let connections = 0
io.on('connection', socket => {
    socket.emit('recieved', 'Welcome to JoeChat\n\rThere are: '+(connections++)+' users online')
    socket.on('message', data => {
        console.log(data);
        let processedDate = processDate(data.time)
        let shapedData = processedDate+' '+data.userName+' '+ data.message
        socket.emit('recieved', shapedData)
        socket.broadcast.emit('recieved', shapedData)
    });
});
io.on('disconnect', socket =>{
    console.log('Disconnecting')
    socket.broadcast.emit('recieved', 'User has left')
    connections--
})
io.on('reconnect', socket=>{
    console.log('Reconnecting')
    socket.broadcast.emit('recieved', 'User is reconnecting')
    connections--
})
const processDate = (objGivenDate)=>{
    let date = new Date(objGivenDate)
    console.log((date.getMinutes()+'').length)
    let hours = (date.getHours()+'').length>1?date.getHours():'0'+date.getHours()
    let mins = (date.getMinutes()+'').length>1?date.getMinutes():'0'+date.getMinutes()
    let secs = (date.getSeconds()+'').length>1?date.getSeconds():'0'+date.getSeconds()
    return`${hours}:${mins}:${secs}`
}
httpServer.listen(3000, () => {
    console.log('go to http://localhost:3000');
});

