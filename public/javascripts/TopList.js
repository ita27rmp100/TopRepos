async function fetchCountryData(link) {
  const req_country = link.slice(link.indexOf('country') + 8).toLowerCase();
  try {
    const CountryDataReq = await fetch(`https://toprepos-api.onrender.com/api/repos?country=${req_country}`);
    const CountryData = await CountryDataReq.json();

    let TopList = '';
    const CountryDataLength = Object.keys(CountryData).length;

    if (CountryDataLength === 0) {
      TopList = `No data is available`;
    } else {
      for (let i = 0; i < CountryDataLength; i++) {
        const p = CountryData[Object.keys(CountryData)[i]];
        TopList += `<new-repo username="${p.repoFullName.slice(0, p.repoFullName.indexOf('/'))}"
                                reponame="${p.repoFullName.slice(p.repoFullName.indexOf('/') + 1)}" 
                                avatar="${p.avatar}" rank="${i + 1}" 
                                points="${p.totalPoints}">
                    </new-repo>\n`;
      }
    }

    $("#loading").remove();
    $("#data").html(TopList);

  } catch (err) {
    console.error(err);
    setTimeout(()=>{window.location = '/';},100000)
  }
}
fetchCountryData(window.location.href);
