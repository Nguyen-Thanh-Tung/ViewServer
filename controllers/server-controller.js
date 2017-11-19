const Server = require('../models/Server');
const Report = require('../models/Report');
const request = require('request');
const constants = require('../constants/constants');
const replace = require('replace');
const mongoose = require('mongoose');
const fs = require('fs');
const async = require('async');

exports.getFlot = (req, res) => {
  if (!global.serverIp) {
    res.render('index');
  } else {
    let promiseReport;
    let serverId = '0';
    if (req.query && req.query.serverId) {
      serverId = req.query.serverId;
      promiseReport = Report.find({server_id: serverId})
        .sort({ _id: -1 })
        .limit(60)
        .select('error_number request_number response_time').exec();
    } else {
      promiseReport = Report.find({})
        .sort({ _id: -1 })
        .limit(60)
        .select('error_number request_number response_time').exec();
    }
    const promiseServer = Server.find({}).select('server_name').exec();

    const arr = [];
    arr.push(promiseServer);
    arr.push(promiseReport);
    Promise.all(arr).then((data) => {
      const serverList = data[0];
      const reportList = data[1];
      let numError = 0;
      let numRequest = 0;
      const responseTimeArr = [];

      if (reportList.length === 0) {
        const hasData = '0';
        res.render('flot', { serverList, rateError: 0, responseTime: 0, hasData, serverId });
      } else {
        for(let i = 0; i < reportList.length; i++ ) {
          numError += reportList[i].error_number;
          numRequest += reportList[i].request_number;
          const tempRT = reportList[i].response_time > constants.maxResponseTime ? constants.maxResponseTime : reportList[i].response_time;
          responseTimeArr.push([i+1, tempRT]);
          const responseTime = JSON.stringify(responseTimeArr);
          if (i === reportList.length - 1) {
            const rateError = (numError/numRequest) * 100;
            const hasData = '1';
            res.render('flot', { serverList, rateError, responseTime, hasData, serverId });
          }
        }
      }
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
    fs.writeFile(file, `const ws = new WebSocket('ws://${global.serverIp}:8000/view');`);

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


