const EventEmitter = require('events');
const readline = require('readline');

//interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new EventEmitter();
//import the server object
//because we need two way communication, we pass client while requireing,
//so that server.js can export server with client as an argument
const server = require('./server')(client);

//listen to 'response' event
server.on('response', (resp) => {
  process.stdout.write('\u001B[2J\u001B[0;0f');//clear terminal
  process.stdout.write(resp);
  process.stdout.write('\n\> ');
});

let command, args;
//every time client input something,
//i.e. everythime 'line' event is fired,
//client will emit 'command'
rl.on('line', (input) => {
  //first arg will be the command and the rest will be args
  [command, ...args] = input.split(' ');
  client.emit('command', command, args);
});
