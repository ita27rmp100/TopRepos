async function getTopUsers() {
    const url = 'https://committers.top/rank_only/algeria.json';
    let response = await fetch(url);
    let data = await response.json();
    let topUsers = data.user.slice(0, 10);

    // Filter users based on account age
    let filteredUsers = [];
    for (let i = 0; i < topUsers.length; i++) {
        const userUrl = `https://api.github.com/users/${topUsers[i]}`;
        try {
            let userResponse = await fetch(userUrl);
            let userData = await userResponse.json();
            let accountAgeYears = (new Date() - new Date(userData.created_at)) / (1000 * 3600 * 24 * 365);
            if (accountAgeYears >= 3) {
                filteredUsers.push(topUsers[i]);
            }
        } catch (err) {
            console.log(`ERROR fetching user ${topUsers[i]}`);
        }
    }
    tops = filteredUsers
    return filteredUsers;
}

async function getTopRepos(users){
    let BestProjects = []
    for (let i = 0; i < users.length; i++) {
        const serRepoURL = `https://api.github.com/users/${users[i]}/repos`;
        try {
            let repoResponse = await fetch(serRepoURL);
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
            console.log(`ERROR fetching repos for user ${filteredUsers[i]}`);
        }
    }
    BestProjects.sort((a,b)=> b.totalPoints - a.totalPoints)
    return BestProjects
}
getTopUsers().then(filteredUsers => {
    console.log(filteredUsers)
    getTopRepos(filteredUsers).then(bestProjects=>{
        console.log(bestProjects)
    })
});