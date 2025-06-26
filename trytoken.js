// api token name : public-api-acess-for-best-repos
// api : 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 
const api = "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"

fetch("https://api.github.com/users/ita27rmp100/repos",{
    headers:{
        "Authorization":`token ${api}`,
        "User-agent":"TopRepos"
    }
})
.then(res=>res.json())
.then(data=>console.log(data))
.catch(err=>console.log(err))