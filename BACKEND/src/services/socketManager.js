let io;

const initSocketManager = (socketIo) => {
  io = socketIo;
  
  io.on('connection', (socket) => {
    console.log('A user connected with id:', socket.id);

    // Test event
    socket.on('client-message', (data) => {
      console.log('Received message from client:', data);
      // Emit back to client
      io.emit('server-response', {
        message: 'Server received: ' + data.message,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = {
  initSocketManager
};
