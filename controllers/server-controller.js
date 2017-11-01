const Server = require('../models/Server');
const request = require('request');

exports.getServerList = (req, res) => {
  const perPage = 50;
  let page = Math.max(0, req.query.page);
  if (!Number.isInteger(page)) {
    page = 0;
  }
  const promise = Server.find({}).limit(perPage).skip(page * perPage).exec();
  promise.then((serverList) => {
    serverList.forEach((server) => {
      request.get('http://localhost:' + server.port + '/check', (err, result) => {
        if (result === 'ok') {
          server.status = 'online';
        } else {
          server.status = 'offline';
        }
      });
    });
    res.render('status', { serverList });
  }).catch((err) => {
    if (err) {
      console.log(err.message);
    }
  })
};

exports.testRequest = (req, res) => {
  res.render('test');
};