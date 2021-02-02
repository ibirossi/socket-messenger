//require socket and call which port to use (5000).
const io = require("socket.io")(5000);

io.on("connection", (socket) => {
  // when connect will pass id of user.
  //Socket creates a new id for each connection.
  //This will allow to make a static id that remains when page refreshes.
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    //loop through recipients.
    //Need to change recipient depending on who is sending and receiving.
    recipients.forEach((recipient) => {
      //removes current recipient(i.e. the sender) from list of recipients
      const newRecipients = recipients.filter((r) => r !== recipient);
      //id = sender of message
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
