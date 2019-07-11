const port = process.env.PORT || 3000
const io = require('socket.io')(port)

var numClients = 0

io.on('connection', (socket) => {
  numClients++
  console.log(`client join, ${numClients} in total`)
  socket.broadcast.emit('client join', numClients)

  socket.on('message', ({ mime, data }) => {
    console.log(`${mime} received: ${data.length} bytes`)
    socket.broadcast.emit('image', data)
  })

  socket.on('disconnect', () => {
    console.log(`client left, ${numClients} remaining`)
    socket.broadcast.emit('client left', numClients)
  })
})

console.log(`server started on port: ${port}`)