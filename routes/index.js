const express = require('express');
const router = express.Router();

// FETCH needed data
async function FetchMetaData() {
  const req = await fetch('http://localhost:3050/api/metadata');
  const response = await req.json();
  return response;
}

/* GET home page. */
router.get('/',async function(req, res, next) {
  const metadata = await FetchMetaData()
  res.render('index', {
    countries: metadata.countries
  });
});

module.exports = router;
