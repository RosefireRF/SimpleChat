const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
class User {
  constructor(id, username){
    this.id = id;
    this.username = username;
  }
}
listOfUsers = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('setUsername', (username) =>{
      listOfUsers.push(new User(socket.id, username));
      io.emit('joinEvent', username)
    });
    socket.on('keypress', function (data){
      io.emit('keyPressed');
    })
    socket.on('keyup', function(){
      io.emit('released');
    })
    socket.on('chat message', (msg) => {
        user = listOfUsers.find(obj => obj.id === socket.id);
        if (user){
          let data = {
            message : msg,
            id : user.username
          }
          io.emit('chat message', data);
        }
      });
    socket.on('disconnect', () => {
      user = listOfUsers.find(obj => obj.id === socket.id);
      if (user){
        io.emit('leaveEvent', user.username);
        listOfUsers = listOfUsers.filter(obj => obj.id !== socket.id);
      }
    });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});