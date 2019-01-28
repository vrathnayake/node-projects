const server = require('net').createServer();
let counter = 0;
let sockets = {};

function timestamp(){
  const now = new Date();
  const ts = `${now.getHours()}: ${now.getMinutes()}`;
  return ts;
}

server.on('connection', socket => {
  
  console.log('Client connected');
  socket.write('Please enter your name:\n');

  /*
  if the socket is not already registered, that is the name of the first timer and so we list the socket
  and return. If we don't return, the name is gonna broadcast! that is ugly!
  */
  socket.on('data', data => {
    if(!sockets[socket.id]){
      socket.name = data.toString().trim();
      socket.id = counter++;
      sockets[socket.id] = socket;
      socket.write(`Hey ${socket.name} welcome to chat world! \n`);
      return;
    }
    
    //write to all connected sockets ie. all sockets in sockets object, except for the one typing
    Object.entries(sockets).forEach(([key,cs]) => {
      if(socket.id == key) return;

      cs.write(`${socket.name}:${timestamp()}:`);
      cs.write(data);
    });
  });

  //let others know when someone leaves the chat
  socket.on('end', () => {
    delete sockets[socket.id];
    Object.entries(sockets).forEach(([key,cs]) => {
      if(socket.id == key) return;
      cs.write(`${socket.name} has left the chat!`);
    });
    console.log('Client disconnected');
  });
});

server.listen(8000, () => console.log('Server bound'));
