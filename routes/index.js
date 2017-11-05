const express = require('express');

const router = express.Router();
const serverController = require('../controllers/server-controller');

/* GET home page. */
router.get('/', serverController.getFlot);
router.get('/flot', serverController.getFlot);
router.get('/config', serverController.getServerList);
router.get('/test', serverController.testRequest);
router.get('/testSystem', serverController.testSystem);
router.post('/deleteClient', serverController.deleteClient);
router.post('/updateServerIp', serverController.updateServerIp);

module.exports = router;