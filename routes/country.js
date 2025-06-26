var express = require('express');
const router = express.Router();
const fs = require("fs")

/* GET home page. */
router.get('/:country?', function(req, res) {
    let req_country = req.params.country.toLowerCase()
    let CountryData = require(`./CountryJSON/${req_country}`)
    let TopList =``
    for (let i = 0; i < Object.keys(CountryData).length; i++) {
        const p = CountryData[Object.keys(CountryData)[i]];
        TopList += `<new-repo username="${p.repoFullName.slice(0,p.repoFullName.indexOf('/'))}" reponame="${p.repoFullName.slice(p.repoFullName.indexOf('/')+1)}" avatar="${p.avatar}" rank="${i+1}" points="${p.totalPoints}"></new-repo> \n`;
    }
    res.render('country',
                {
                    country: req_country.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()) ,
                    top:TopList
                });
    // let TopList
    // const path = require('path');
    // fs.readFile(path.join(__dirname, 'CountryHTML', `${req_country}.html`), "utf-8", (err, data) => {
    //     if(err){
    //         return res.status(404).send("Country page not found.")
    //     }
    //     else{
    //         TopList = data
    //         res.render('country',
    //             {
    //                 country: req_country.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()) ,
    //                 top:TopList
    //             });
    //     }
    // })
});

module.exports = router;
