const EventEmitter = require('events');

class Server extends EventEmitter {
  //constructor receives the client when instanciating
  constructor(client) {
    super();
    //create a task object
    this.tasks = {};
    this.taskId = 1;
    //we want this executed after the client heard the 'response'
    process.nextTick(() => {
      this.emit(
        'response',
        'Type a command (help to list commands)'
      );
    });
    //listen to any 'command' event
    //in any of the folloeing commants, execute relevent function
    client.on('command', (command, args) => {
      switch (command) {
      case 'help':
      case 'add':
      case 'ls':
      case 'delete':
        this[command](args);
        break;
      default:
        this.emit('response', 'Unknown command...');
      }
    });
  }

  tasksString() {
    return Object.keys(this.tasks).map(key => {
      return `${key}: ${this.tasks[key]}`;
    }).join('\n');
  }

  help() {
    this.emit('response', `Available Commands:
  add task
  ls
  delete :id`
    );
  }
  add(args) {
    this.tasks[this.taskId] = args.join(' ');
    this.emit('response', `Added task ${this.taskId}`);
    this.taskId++;
  }
  ls() {
    this.emit('response', `Tasks:\n${this.tasksString()}`);
  }
  delete(args) {
    delete(this.tasks[args[0]]);//delete operator delete properties from an object
    this.emit('response', `Deleted task ${args[0]}`);
    }
}

//export the server as a function
//pass a client object and instantiate server with client
module.exports = (client) => new Server(client);
