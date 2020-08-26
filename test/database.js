const assert = require('assert');
const db = require('../db');

describe('Database', () => {
  it('Should include all models', () => {
    assert.notEqual(typeof db.Reminder, null);
  });
  describe('Reminders', () => {
    it('Should create reminders', async () => {
      const result = await db.Reminder.create({
        description: 'Remember the thing!',
        time: new Date(),
      });
      console.log(result);
      assert.equal(result.description, 'Remember the thing!');
      result.destroy();
    });
  });
});
