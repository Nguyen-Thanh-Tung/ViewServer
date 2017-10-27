const express = require('express');
const WebSocket = require('ws');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('flot');
});

module.exports = router;