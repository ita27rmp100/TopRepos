var express = require('express');
const {exec} = require("child_process")
const router = express.Router();
let statusFetch = {}

router.get('/status/:country',function(req,res){
    const req_country = req.params.country
    res.json({done:statusFetch[req_country]||false})
})

router.get('/:country',function(req,res){
    const req_country = req.params.country
    statusFetch[req_country] = false
    res.render('loading',{country:req_country})
    exec(`node filter.js ${req_country}`, (error) => {
        if (error) {
            console.error("Error:", error);
            return;
        }
        statusFetch[req_country] = true
    });
})

module.exports = router