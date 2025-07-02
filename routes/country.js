var express = require('express');
const router = express.Router();
const {exec} = require("child_process")
const countries = require("../countryList.json").countries
/* GET home page. */
router.get('/:country', function(req, res) {
    let req_country = req.params.country.toLowerCase()
    if(!countries.includes(req_country)){res.redirect('/')}
    else{
        // fetch json data of best projects in that country
        const countryPath = require.resolve(`./CountryJSON/${req_country}`)
        delete require.cache[countryPath]
        let CountryData = require(countryPath)
        console.log(CountryData)
        let TopList =``
        const CountryDataLength = Object.keys(CountryData).length
        if (CountryDataLength == 0) {
            res.redirect(`/loading/${req_country}`)
        }
        else {
            for (let i = 0; i < CountryDataLength; i++) {
                const p = CountryData[Object.keys(CountryData)[i]];
                TopList += `<new-repo username="${p.repoFullName.slice(0,p.repoFullName.indexOf('/'))}"
                                    reponame="${p.repoFullName.slice(p.repoFullName.indexOf('/')+1)}" 
                                    avatar="${p.avatar}" rank="${i+1}" 
                                    points="${p.totalPoints}">
                            </new-repo> \n`;
            }
            res.render('country', {
                country: req_country.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
                top: TopList
            });
        }
    }
});
router.get("/",function(req,res){
    res.redirect('/')
})
module.exports = router;