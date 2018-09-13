var io = {};

SocketServer = {
  io: function (argument) {
    return io;
  },
  init: function (server) {
    io = require('socket.io').listen(server);
    io.on('connection', function (socket) {

      socket.on("media", function (media) {
        io.emit("media", media)
      })
      socket.on("files", function (files) {
        io.emit("files", files)
      })
      socket.on("controls", function (actions) {
        io.emit("controls", actions)
      })
      socket.on("fullscreen", function () {
        io.emit("fullscreen")
      })
      socket.on("startDownload", function (media) {
        io.emit("startDownload",media)
      })
      socket.on("downloadEnded", function (media) {
        io.emit("downloadEnded",media)
      })
    });
  }
}


module.exports = SocketServer;