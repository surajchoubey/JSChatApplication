const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user', name => {
      users[socket.id] = name
      socket.broadcast.emit('user-connected', name)
      console.log(`${users[socket.id]} has joined the server`);
    })
    socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id]);
      console.log(`${users[socket.id]} has left the server`);
      delete users[socket.id]
    })
})

http.listen(process.env.PORT || 3000, () => console.log(`Server has started.`));