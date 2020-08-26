'use strict';

const Sequelize = require('sequelize');
const Reminder = require('./models/Reminder');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

const models = {
  Reminder: Reminder.init(sequelize, Sequelize),
};

module.exports = {
  ...models,
  sequelize,
};
