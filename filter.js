require("dotenv").config();
const fs = require("fs");
const { configuration, uploadProcessData } = require("./crud");

const api = process.env.GITHUB_TOKEN;

async function getTopUsers(country) {
    const url = `https://committers.top/rank_only/${country}.json`;
    let response = await fetch(url);
    let data = await response.json();
    let topUsers = data.user.slice(0, 250);

    let filteredUsers = [];
    for (let i = 0; i < topUsers.length; i++) {
        const userUrl = `https://api.github.com/users/${topUsers[i]}`;
        try {
            let userResponse = await fetch(userUrl, {
                headers: {
                    "Authorization": `token ${api}`,
                    "User-agent": "TopRepos"
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

async function getTopRepos(users) {
    let BestProjects = [];
    for (let i = 0; i < users.length; i++) {
        const serRepoURL = `https://api.github.com/users/${users[i]}/repos?per_page=100`;
        try {
            let repoResponse = await fetch(serRepoURL, {
                headers: {
                    "Authorization": `token ${api}`,
                    "User-agent": "TopRepos"
                }
            });
            let repos = await repoResponse.json();
            repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 3)
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

    BestProjects = BestProjects.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 50);
    return BestProjects;
}

async function uploadToFirestore(country, bestProjects) {
    for (let rank = 0; rank < bestProjects.length && rank < 50; rank++) {
        const documentId = String(rank + 1);  // "1", "2", ... "50"
        const data = bestProjects[rank];

        await uploadProcessData(data, country, documentId);
    }
    console.log(`✅  Firestore upload done for: ${country}`);
}

const country = process.argv[2];

if (!country) {
    console.error("Please provide a country name. Usage: node filter.js <country>");
    process.exit(1);
}

(async () => {
    try {
        // Init Firebase
        await configuration();

        console.log(`🔍  Fetching top users for: ${country}`);
        const filteredUsers = await getTopUsers(country);
        console.log(`Filtered users count: ${filteredUsers.length}...`);

        const bestProjects = await getTopRepos(filteredUsers);
        console.log(`Top repos found: ${bestProjects.length} ...`);


        // Upload to Firestore
        console.log(`Uploading to Firestore collection: "${country}"...`);
        await uploadToFirestore(country, bestProjects);

        console.log(`${country} : done`);
    } catch (error) {
        console.error(error);
    }
})();