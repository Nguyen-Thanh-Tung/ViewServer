const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');

app.use('/', index);

server.listen(9999, () => {
  console.log('Connect success on port 9999');
});
