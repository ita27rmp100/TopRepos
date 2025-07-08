const fs = require("fs")
require("dotenv").config()
const api = process.env.GITHUB_TOKEN

async function getTopUsers(country) {
    const url = `https://committers.top/rank_only/${country}.json`;
    let response = await fetch(url);
    let data = await response.json();
    let topUsers = data.user.slice(0, 150);
    // Filter users based on account age
    let filteredUsers = [];
    for (let i = 0; i < topUsers.length; i++) {
        const userUrl = `https://api.github.com/users/${topUsers[i]}`;
        try {
            let userResponse= await fetch(userUrl,{
                                        headers:{
                                            "Authorization":`token ${api}`,
                                            "User-agent":"TopRepos"
                                        }
                                    });
            let userData = await userResponse.json();
            let accountAgeYears = (new Date() - new Date(userData.created_at)) / (1000 * 3600 * 24 * 365);
            if (accountAgeYears >= 1 && userData.followers >= 15) {
                filteredUsers.push(topUsers[i]);
            }
        } catch (err) {
            console.log(`ERROR fetching user ${topUsers[i]}`);
        }
    }
    return filteredUsers;
}
async function getTopRepos(users){
    let BestProjects = []
    for (let i = 0; i < users.length; i++) {
        const serRepoURL = `https://api.github.com/users/${users[i]}/repos?per_page=100`;
        try {
            let repoResponse= await fetch(serRepoURL,{
                                        headers:{
                                            "Authorization":`token ${api}`,
                                            "User-agent":"TopRepos"
                                        }
                                    })
            let repos = await repoResponse.json();
            repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5)
                .forEach(e => {
                    BestProjects.push({
                        repoFullName: e.full_name,
                        totalPoints: (e.stargazers_count * 2) + (e.watchers_count / 2) + (e.forks_count / 2) - e.open_issues_count,
                        avatar: e.owner.avatar_url
                    });
                });
        } catch (err) {
            console.log(`ERROR fetching repos for user ${users[i]}`);
        }
    }
    BestProjects = BestProjects.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 10);
    return BestProjects;
}

// filter and post data 
const country = process.argv[2];
getTopUsers(country).then(filteredUsers => {
    let TopList = '' , CountryJSON = {}
    getTopRepos(filteredUsers).then(bestProjects=>{
        for (let rank = 0; rank < bestProjects.length && rank < 15; rank++) {
            const p = bestProjects[rank];
            TopList += `<new-repo username="${p.repoFullName.slice(0,p.repoFullName.indexOf('/'))}" reponame="${p.repoFullName.slice(p.repoFullName.indexOf('/')+1)}" avatar="${p.avatar}" rank="${rank+1}" points="${p.totalPoints}"></new-repo> \n`;
            CountryJSON[String(rank+1)] = p
        }
        // write json code
        const path_JSON = `./routes/CountryJSON/${country}.json`;
        fs.mkdirSync('./routes/CountryJSON', { recursive: true });
        fs.writeFile(path_JSON, JSON.stringify(CountryJSON, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
        });
        // end
        console.log(`${country} : done`)
    }).catch(error=>console.log(error))
});
