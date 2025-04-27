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

    // Join room for specific item updates
    socket.on('join-item-room', (itemId) => {
      socket.join(`item-${itemId}`);
      console.log(`User ${socket.id} joined room for item ${itemId}`);
    });

    // Leave room for specific item updates
    socket.on('leave-item-room', (itemId) => {
      socket.leave(`item-${itemId}`);
      console.log(`User ${socket.id} left room for item ${itemId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

// Function to emit stock updates to specific item room
const emitStockUpdate = (itemId, newStock, itemDetails) => {
  if (io) {
    io.to(`item-${itemId}`).emit('stock-update', {
      itemId,
      stock: newStock,
      ...itemDetails
    });
  }
};

module.exports = {
  initSocketManager,
  emitStockUpdate
};
