var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var currentCharacter = "";
var suggestingCharacter = "";

io.on("connection", function (socket) {
  console.log("User connected");

  socket.on("channel-client-to-client", function (msg) {
    io.emit("client-to-client", suggestingCharacter, msg);
  });

  socket.on("channel-whatever", function (msg) {
    io.emit("whatever", msg);
  });

  socket.on("channel-suggestion", function (player, from, msg) {
    suggestingCharacter = player;
    const sentence = from + "'s suggsetion: " + msg;
    console.log(sentence);
    io.emit("message", sentence);
  });

  socket.on("channel-accusation", function (from, msg) {
    const sentence = from + "'s accusation: " + msg;
    console.log(sentence);
    io.emit("message", sentence);
  });

  socket.on("channel-current-player", function (
    current_player,
    current_character,
    prettifiedCurrentCharacter
  ) {
    currentCharacter = current_character;
    const tag = current_player + " (" + prettifiedCurrentCharacter + ")'s";
    console.log(tag);
    io.emit("current-player", tag);
    io.emit("update-board", current_character);
  });

  socket.on("channel-player-move", function (tag) {
    io.emit("player-move", tag);
    io.emit("update-board", currentCharacter);
  });

  socket.on("channel-player-move-only", function (tag) {
    io.emit("player-move", tag);
  });

  socket.on("channel-disapprove", function (msg, a) {
    io.emit("disapprove", msg, a);
  });

  socket.on("channel-new-player", function (player) {
    const response = player + " has joined the game!";
    console.log(response);
    io.emit("new-player", response);
  });

  socket.on("channel-start", function (from) {
    const response = "Game is started by " + from + "!";
    console.log(response);
    io.emit("start", response);
  });

  socket.on("disconnect", function () {
    console.log("User disconnected");
  });
});

http.listen(3001, function () {
  console.log("Listening on *:3001");
});
