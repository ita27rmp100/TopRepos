const countries = ["algeria","egypt", "saudi_arabia",
    "united_states", "canada", "brazil", "mexico", "argentina",
    "uk", "germany", "france", "italy", "spain", "russia",
    "china", "india", "japan", "south_korea", "indonesia", "turkey",
    "australia", "new_zealand","belgium","switzerland",
    "south_africa", "nigeria", "kenya", "ethiopia",
    "uae", "iran","iraq","syria","yemen","qatar",
    "poland", "netherlands", "sweden"
];

console.log(countries.length)
////////////////////////////////  FETCH JSON data from committers.top
const url = 'https://committers.top/rank_only/algeria.json'
$.get(url,function(data){
    console.log(data.user)
}).done(console.log('done')).fail(console.log('fail')).always("HTTP GET end")

for (let i = 0; i < countries.length; i++) {
    const url = `https://committers.top/rank_only/${countries[i]}.json`
    $.get(url, function(data) {
        console.log("No error");
    }).done(function() {
        console.log('done');
    }).fail(function() {
        countries.splice(i, 1);
        console.log(`Removed ${countries[i]} due to error`);
    }).always(function() {
        console.log("HTTP GET end");
    });
}
console.log(countries)

// When document is ready