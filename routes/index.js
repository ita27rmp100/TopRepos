const express = require('express');
const router = express.Router();
/* GET home page. */
router.get('/',async function(req, res, next) {
  res.render('index', {
    countries: [
                "algeria", "argentina", "australia", "belgium", "brazil",
                "canada", "china", "egypt", "ethiopia", "finland",
                "france", "germany", "hong_kong", "india", "indonesia",
                "iran", "iraq", "italy", "japan", "kenya",
                "luxembourg", "mexico", "morocco", "netherlands", "new_zealand",
                "nigeria", "norway", "palestine", "poland", "portugal",
                "qatar", "russia", "saudi_arabia", "south_africa", "south_korea",
                "spain", "sweden", "switzerland", "syria", "taiwan",
                "tunisia", "turkey", "uae", "uk", "ukraine",
                "united_states", "yemen",
              ]
  });
});

module.exports = router;