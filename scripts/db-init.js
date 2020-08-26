'use strict';

const db = require('../db');

(async () => {
  console.log('Syncing database..');
  try {
    await db.Reminder.sync({ force: true });
    console.log('Success!');
  }
  catch (error) {
    console.error('An error occured', error);
    process.exit();
  }
})();
