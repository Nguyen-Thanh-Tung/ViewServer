const express = require('express');

const router = express.Router();
const serverController = require('../controllers/server-controller');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index');
});
router.get('/flot', (req, res) => {
  res.render('flot');
});
router.get('/config', serverController.getServerList);
router.get('/test', serverController.testRequest);
router.get('/testSystem', serverController.testSystem);
router.post('/deleteClient', serverController.deleteClient);
router.post('/updateServerIp', serverController.updateServerIp);

module.exports = router;