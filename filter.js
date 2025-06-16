// async function getTopUsers() {
//     const url = 'https://committers.top/rank_only/algeria.json';
//     let response = await fetch(url);
//     let data = await response.json();
//     let topUsers = data.user.slice(0, 10);

//     // Filter users based on account age
//     let filteredUsers = [];
//     for (let i = 0; i < topUsers.length; i++) {
//         const userUrl = `https://api.github.com/users/${topUsers[i]}`;
//         try {
//             let userResponse = await fetch(userUrl);
//             let userData = await userResponse.json();
//             let accountAgeYears = (new Date() - new Date(userData.created_at)) / (1000 * 3600 * 24 * 365);
//             if (accountAgeYears >= 3) {
//                 filteredUsers.push(topUsers[i]);
//             }
//         } catch (err) {
//             console.log(`ERROR fetching user ${topUsers[i]}`);
//         }
//     }
//     console.log(filteredUsers);
// }

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
    return filteredUsers;
}

getTopUsers().then(console.log);