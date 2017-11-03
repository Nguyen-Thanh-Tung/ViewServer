const mongoose = require('mongoose');
const constants = require('../constants/constants');

exports.connectDatabase = () => {
  mongoose.connect(constants.databaseUrl, {
    useMongoClient: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Cant connect DB'));
};