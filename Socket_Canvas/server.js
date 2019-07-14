const express = require('express');
const app = express();
const server = app.listen(3000); 

app.use(express.static('public'));

console.log('my socket server is running at port 3000');

const socket = require('socket.io');
const io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log(`new connection: ${socket.id}`);

  // 接收并处理来自客户端的信息
  socket.on('mouse', handleMouseMsg); 
  function handleMouseMsg(mouseMsg) {
    // 将信息广播给其他客户端（不包括传输进信息的客户端）
    socket.broadcast.emit('mouse', mouseMsg);
  }
}