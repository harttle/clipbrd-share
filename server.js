const port = process.env.PORT || 3000
const io = require('socket.io')(port)

var numClients = 0

io.on('connection', (socket) => {
  numClients++
  socket.broadcast.emit('client join', numClients)

  socket.on('content', (data) => {
    socket.broadcast.emit('content', data)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('client left', numClients)
  })
})

console.log(`server started on port: ${port}`)