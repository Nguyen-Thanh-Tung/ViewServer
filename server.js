const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const helpers = require('./helpers/helpers');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


helpers.connectDatabase();
const index = require('./routes/index');
global.serverIp = '0.0.0.0';

app.use('/', index);

server.listen(9999, () => {
  console.log('Connect success on port 9999');
});
