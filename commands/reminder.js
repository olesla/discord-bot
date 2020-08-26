'use strict';

const Discord = require('discord.js');
const db = require('../db');
const { prefix } = require('../config.json');

const getReply = async (msg) => {
  try {
    const collection = await msg.channel.awaitMessages(
      m => m.author.id === msg.author.id, {
        max: 1,
        time: 30000,
      },
    );
    return collection.first().content;
  }
  catch (error) {
    msg.channel.send('Too slow..');
    return false;
  }
};

module.exports = {
  name: 'reminder',
  description: 'Add a reminder',
  args: true,
  usage: '<add | list | delete>',
  async execute(msg, args) {

    if (!args[0]) {
      return msg.channel.send(`Usage: \`${prefix}${this.name} ${this.usage}\``);
    }

    if (args[0] === 'list') {
      const reminders = await db.Reminder.findAll({
        attributes: ['id', 'description', 'time'],
      });
      if (!reminders.length) return msg.channel.send('No reminders!');

      const reply = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Reminders');

      for (const r of reminders) {
        reply
          .addField(r.getFormattedTime(), `\`${r.id}\` \`${r.description}\``);
      }

      return msg.channel.send(reply);
    }

    if (args[0] === 'add') {
      msg.channel.send('What do you want to remember?');
      const description = await getReply(msg);
      if (!description) return;

      msg.channel
        .send('When do you wish to be reminded? Format: `YYYY-MM-DD HH:MM:SS`');
      const dateString = await getReply(msg);
      if (!dateString) return;
      const parsed = Date.parse(dateString);
      if (isNaN(parsed)) {
        return msg.channel.send('That\'s not a valid date. Try again.');
      }

      const time = new Date(parsed);
      try {
        const reminder = await db.Reminder.create({ description, time });
        msg.channel.send('Reminder was created!');
        setTimeout(() => {
          msg.channel.send(reminder.description);
          reminder.destroy();
        }, Date.parse(reminder.time) - Date.now());
      }
      catch (error) {
        console.error(error);
        return msg.channel.send('Something went wrong');
      }
    }

    if (args[0] === 'delete') {
      msg.channel.send('Which ID do you wish to delete?');
      const id = await getReply(msg);

      const reminder = await db.Reminder.findOne({ where: { id } });
      if (!reminder) return msg.channel.send('Cant find that reminder');

      await reminder.destroy();
      return msg.channel.send('Reminder deleted');
    }
  },
};
