const { v4: uuidV4 } = require('uuid')
const express = require('express')
const path = require('path')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.get('/live/', (req, res) => {
    res.redirect(`/live/${uuidV4()}`)
})

app.get('/live/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

app.use('/chat', (req, res) => {
    res.render('index.html')
})

let messages = []

io.on('connection', (socket) => {
    socket.emit('previousMessages', messages)
    socket.on('sendMessage', (data) => {
        messages.push(data)
        socket.broadcast.emit('receivedMessage', data)
    })

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('Usuario-conectado', userId)
        console.log(roomId, userId)

        socket.on('disconect', () => {
            socket.to(roomId).broadcast.emit('user-disconected', userId)
        })
    })
})

server.listen(3000)
