'use strict';

const { Model } = require('sequelize');

class Reminder extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: DataTypes.TEXT,
      time: DataTypes.DATE,
    }, {
      hooks: {
        // afterCreate: reminder => {
        //   console.log(reminder);
        // },
      },
      sequelize,
    });
  }

  getFormattedTime() {
    return `${this.time.toDateString()} ${this.time.toLocaleTimeString()}`;
  }
}

module.exports = Reminder;
