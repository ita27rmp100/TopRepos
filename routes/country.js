var express = require('express');
const router = express.Router();
const fs = require("fs")
const {exec} = require("child_process")
/* GET home page. */
router.get('/:country?', function(req, res) {
    let req_country = req.params.country.toLowerCase()
    // fetch json data of best projects in that country
    const countryPath = require.resolve(`./CountryJSON/${req_country}`)
    delete require.cache[countryPath]
    let CountryData = require(countryPath)
    console.log(CountryData)
    let TopList =``
    for (let i = 0; i < Object.keys(CountryData).length; i++) {
        const p = CountryData[Object.keys(CountryData)[i]];
        TopList += `<new-repo username="${p.repoFullName.slice(0,p.repoFullName.indexOf('/'))}" reponame="${p.repoFullName.slice(p.repoFullName.indexOf('/')+1)}" avatar="${p.avatar}" rank="${i+1}" points="${p.totalPoints}"></new-repo> \n`;
    }
    if (Object.keys(CountryData).length == 0) {
        exec(`node filter.js ${req_country}`, (error) => {
            if (error) {
                console.error("Error:", error);
                return res.status(500).send("Internal Server Error");
            }
            return res.redirect(`/country/${req_country} <a href="/">go back to home page</a>`);
        });
    } else {
        res.render('country', {
            country: req_country.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
            top: TopList
        });
    }
});

module.exports = router;
