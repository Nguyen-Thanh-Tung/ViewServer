const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

connectDatabase = () => {
  mongoose.connect('mongodb://127.0.0.1/logsystem', {
    useMongoClient: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Cant connect DB'));
};
connectDatabase();
const index = require('./routes/index');

app.use('/', index);

server.listen(9999, () => {
  console.log('Connect success on port 9999');
});
