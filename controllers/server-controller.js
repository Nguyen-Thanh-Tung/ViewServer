const Server = require('../models/Server');
const request = require('request');
const constants = require('../constants/constants');
const replace = require('replace');
const helpers = require('../helpers/helpers');

exports.getServerList = (req, res) => {

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
  })
};

exports.testRequest = (req, res) => {
  res.render('test');
};

exports.testSystem = (req, res) => {
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
};

exports.deleteClient = (req, res) => {
  const clientIp = req.body.clientIp;
  if (clientIp) {
    Server.remove({ server_ip: clientIp}, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({
          status: 200,
          message: 'Xóa thành công.',
        });
      }
    });
  } else {
    res.json({
      status: 404,
      message: 'Không tồn tại Ip',
    });
  }
};

exports.updateServerIp = (req, res) => {
  global.serverIp = req.body.serverIp;
  const file = './public/javascripts/index.js';
  replace({
    regex: 'localhost',
    replacement: `${global.serverIp}`,
    paths: [file],
    recursive: true,
    silent: true,
  });
  replace({
    regex: '127.0.0.1',
    replacement: `${global.serverIp}`,
    paths: ['./constants/constants.js'],
    recursive: true,
    silent: true,
  });
  helpers.connectDatabase();
  res.json({
    status: 200,
    message: 'Update success',
  })
};

