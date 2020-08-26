'use strict';

// If you need to access your client instance from inside one of your command
// files, you can access it via message.client. If you need to access things
// such as external files or modules, you should re-require them at the top of
// the file.
const axios = require('axios');
const { prefix } = require('../config.json');

/**
 * Makes a GET request to the epguides-api then returns the result
 * https://epguides-api.readthedocs.io/en/latest/
 *
 * @param {String} show
 * @param {String} type <info|released|next|last>
 */
const epguides = async (show, type) => {
  try {
    return await axios.get(`https://epguides.frecar.no/show/${show}/${type}/`);
  }
  catch (error) {
    console.error('Error occured when getting data from epguides', error);
    return false;
  }
};

module.exports = {
  name: 'epguides',
  description: 'Look up a TV-series on epguides.com',
  args: true,
  usage: '<info | last | next | all> <show>',
  async execute(msg, args) {
    if (!args[1]) {
      return msg.channel.send(`Usage: \`${prefix}${this.name} ${this.usage}\``);
    }

    const showName = args.slice(1, args.length).join('');

    if (args[0] === 'info') {
      const result = await epguides(showName, 'info');
      if (!result) {
        return msg.channel.send('I could not find this..');
      }

      return msg.channel.send(
        `https://www.imdb.com/title/${result.data.imdb_id}/`);
    }

    if (args[0] === 'last') {
      const result = await epguides(showName, 'last');
      if (!result) {
        return msg.channel.send('I could not find this..');
      }

      const episode = result.data.episode || {};
      return msg.channel.send(
        `Title: ${episode.title || ''}
        Season: ${episode.season || ''}
        Episode: ${episode.number || ''}
        Release date: ${episode.release_date || ''}`);
    }

    if (args[0] === 'next') {
      const result = await epguides(showName, 'next');
      if (!result || !result.data.episode) {
        return msg.channel.send('I could not find this..');
      }

      const episode = result.data.episode || {};
      return msg.channel.send(
        `Title: ${episode.title || ''}
        Season: ${episode.season || ''}
        Episode: ${episode.number || ''}
        Release date: ${episode.release_date || ''}`);
    }

    if (args[0] === 'all') {
      // messages are too large to customize this. Return a link
      return msg.channel.send(`http://epguides.com/${showName}/`);
    }
  },
};
