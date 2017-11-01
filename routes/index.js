const express = require('express');

const router = express.Router();
const serverController = require('../controllers/server-controller');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('flot');
});

router.get('/config', serverController.getServerList);
router.get('/test', serverController.testRequest);

module.exports = router;