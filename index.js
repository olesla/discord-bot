'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// fs.readdirSync() returns an array with all the file names in a directory
const cmdFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const cmdFile of cmdFiles) {
  const command = require(`./commands/${cmdFile}`);

  // set a new item in the Collection with the key as the command name
  // and the value as the exported module
  client.commands.set(command.name, command);
}

client.login(token);

client.on('ready', async () => {
  console.log('Bot was successfully started');
});

client.on('message', async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  // String.slice([start[, end]]) returns a new array containing start to end
  // String.trim() removes whitespace from both ends of a string
  // String.split([separator]) divides a string to ordered list of substrings
  const args = msg.content.slice(prefix.length).trim().split(/ +/);

  // Array.shift() returns and removes the first element in the array
  // This way we extract the command, and don't have to worry about it
  // being a part of the arguments which we will use later
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  // When the user does not provide required arguments
  if (command.args && !args.length) {
    return msg.channel.send(
      `Usage: \`${prefix}${command.name || ''} ${command.usage || ''}\``);
  }

  try {
    command.execute(msg, args);
  }
  catch (error) {
    console.error(error);
    msg.reply('There was an error trying to execute that command');
  }
});
