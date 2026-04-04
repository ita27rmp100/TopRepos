const express = require('express');
const router = express.Router();
const { configuration, GetData } = require("../crud"); // adjust path if needed

// Initialize Firebase once when the router loads
configuration();
// Helper: build the TopList HTML from Firestore docs 
function buildTopListHTML(countryData) {
    if (!countryData || countryData.length === 0) {
        return `<p>No data is available</p>`;
    }

    // Sort by totalPoints descending (Firestore doesn't guarantee order)
    const sorted = [...countryData].sort((a, b) => b.totalPoints - a.totalPoints);

    let TopList = '';
    sorted.forEach((p, i) => {
        TopList += `<new-repo username="${p.repoFullName.slice(0, p.repoFullName.indexOf('/'))}"
                        reponame="${p.repoFullName.slice(p.repoFullName.indexOf('/') + 1)}"
                        avatar="${p.avatar}" rank="${i + 1}"
                        points="${p.totalPoints}">
                    </new-repo>\n`;
    });

    return TopList;
}

// GET /country/:country
router.get('/:country', async function (req, res) {
    const countryKey = req.params.country.toLowerCase();
    const countryTitle = countryKey.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

    try {
        const countryData = await GetData(countryKey);   // collection name = country key
        const topListHTML = buildTopListHTML(countryData);

        res.render('country', {
            country: countryTitle,
            topListHTML,                                  // ready-made HTML for the view
        });
    } catch (error) {
        console.error(`Error fetching data for ${countryKey}:`, error);
        res.render('country', {
            country: countryTitle,
            topListHTML: `<p>Error loading data for ${countryTitle}.</p>`,
        });
    }
});

router.get("/", function (req, res) {
    res.redirect('/');
});

module.exports = router;