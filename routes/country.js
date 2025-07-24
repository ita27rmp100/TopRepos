var express = require('express');
const router = express.Router();
const {exec} = require("child_process")
/* GET home page. */
router.get('/:country', function(req, res) {
    res.render('country', {
        country: req.params.country.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
    });
});
router.get("/",function(req,res){
    res.redirect('/')
})
module.exports = router;