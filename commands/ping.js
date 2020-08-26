'use strict';

// If you need to access your client instance from inside one of your command
// files, you can access it via message.client. If you need to access things
// such as external files or modules, you should re-require them at the top of
// the file.

module.exports = {
  name: 'ping',
  description: 'Ping!',
  args: true,
  execute(message) {
    message.channel.send('Pong.');
  },
};
