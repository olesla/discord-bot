'use strict';

const axios = require('axios');
const Discord = require('discord.js');
const API_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';

module.exports = {
  name: 'forecast',
  description: 'Gets weather forecast from the yr.no API',
  args: false,
  usage: '',
  async execute(msg) {
    const reply = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Forecast');

    try {
      const result = await axios.get(`${API_URL}?lat=51.5&lon=0`);

      for (const time of result.data.properties.timeseries) {
        const row =
          `\`${time.time}: ${time.data.instant.details.air_temperature}\``;
        reply.addField(row);
      }

      msg.channel.send(reply);

    }
    catch (error) {
      console.error(error);
      return msg.channel.send('Error when fetching forecast data');
    }
  },
};
