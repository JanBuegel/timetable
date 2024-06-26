const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  stage: String
});

module.exports = mongoose.model('Event', eventSchema);
