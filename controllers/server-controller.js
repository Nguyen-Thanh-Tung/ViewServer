const Server = require('../models/Server');
const request = require('request');
const constants = require('../constants/constants');
const replace = require('replace');
const mongoose = require('mongoose');

exports.getFlot = (req, res) => {
  if (!global.serverIp) {
    res.render('index');
  } else {
    const promise = Server.find({}).select('server_name').exec();
    promise.then((serverList) => {
      res.render('flot', { serverList });
    });
  }
};

exports.getServerList = (req, res) => {
  if (!global.serverIp) {
    res.send('Config serverIp before access link');
  } else {
    const perPage = constants.numServerPerPage;
    let page = Math.max(0, req.query.page);
    if (!Number.isInteger(page)) {
      page = 0;
    }
    const promise = Server.find({}).limit(perPage).skip(page * perPage).exec();
    promise.then((serverList) => {
      serverList.forEach((server) => {
        request.get(constants.domain + ':' + server.port + constants.pathCheckServer, (err, result) => {
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
    });
  }
};

exports.testRequest = (req, res) => {
  res.render('test');
};

exports.testSystem = (req, res) => {
  if (!global.serverIp) {
    res.send('Config serverIp before access link');
  } else {
    Server.aggregate([
      {
        $group: {
          _id: '$server_ip',
          count: {$sum: 1}
        }
      }
    ], function (err, result) {
      if (err) {
        res.send('Error when get client');
      } else {
        const clientList = result.map((client) => {
          return {
            ip: client._id,
            numberServer: client.count,
          }
        });
        const server = {
          ip: global.serverIp,
        };
        res.render('testSystem',{ clientList, server });
      }
    });
  }
};

exports.deleteClient = (req, res) => {
  const clientIp = req.body.clientIp;
  if (clientIp) {
    Server.remove({ server_ip: clientIp}, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.send('callback(' + JSON.stringify({
          status: 200,
          message: 'Delete success.',
        }) + ')');
      }
    });
  } else {
    res.send('callback(' + JSON.stringify({
      status: 404,
      message: 'Không tồn tại Ip',
    }) + ')');
  }
};

exports.updateServerIp = (req, res) => {
  const serverIp = req.body.serverIp;
  mongoose.connect(`mongodb://${serverIp}/logsystem`, {
    useMongoClient: true,
  });
  const db = mongoose.connection;
  db.on('open', function() {
    console.log('Connect DB success');
    global.serverIp = serverIp;
    const file = './public/javascripts/index.js';
    replace({
      regex: 'localhost',
      replacement: `${global.serverIp}`,
      paths: [file],
      recursive: true,
      silent: true,
    });
    res.send('callback(' + JSON.stringify({
        status: 200,
        message: 'Connect success',
      }) + ')');
  });
  db.on('error', function(err) {
    console.log('Cant connect DB');
    res.send('callback(' + JSON.stringify({
        status: 404,
        message: 'Connect fail',
      }) + ')');
  });

};

exports.getNumberError = (req, res) => {
  const promise = Report.find({})
}

