const express = require('express');
const router = express.Router();
const LastUpdate = require("../countryList.json").LastUpdate
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{LastUpdate});
});

module.exports = router;
