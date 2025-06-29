const countries = [
    "algeria","argentina","australia","belgium","brazil","canada","china",
    "egypt","ethiopia","france","germany","india","indonesia","iran","iraq",
    "italy","japan","kenya","mexico","netherlands","new_zealand","nigeria",
    "poland","qatar","russia","saudi_arabia","south_africa","ukraine","spain",
    "sweden","switzerland","syria","turkey","uae","uk","united_states","yemen",
    "morocco","palestine","tunisia","finland","hong_kong","luxembourg","norway",
    "portugal","south_korea","taiwan"
  ];
// When document is ready
$(document).ready(function(){
    // coutries list
    countries.sort()
    for (let i = 0 ; i<countries.length;i++) {
        const countryName = countries[i].replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());
        $("#countryList").append(`<a class="list-group-item list-group-item-action ${i==0 ? "active" : ""}" href="/country/${countries[i]}">${countryName}</a>`)
    }
    // copy rights year
    $("#year").text((new Date()).getFullYear())  
})
// Event listener for Collaspe button
document.getElementById("toggler").addEventListener("click",function(){
    $("#navbarNav").slideToggle()
})
// functions needed
function visit(user_repo){
    window.open(`https://github.com/${user_repo}`,"_blank")
}
// needed tags
customElements.define(
    "new-repo",class extends HTMLElement{
        connectedCallback(){
            let username = this.getAttribute("username")
            let reponame = this.getAttribute("reponame")
            this.innerHTML = 
                            `<div class="card card-profile shadow-sm mt-3" id="preview" onclick=visit("${username}/${reponame}")>
                                <div class="card-body">
                                    <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" width="25px" height="25px" alt="githubIcon" class="right float-right">
                                    <div class="d-flex align-items-center mb-3 right">
                                        <img src="${this.getAttribute("avatar")}" width="60px" height="60px" alt="Profile Image" class="profile-image rounded right" id="avatar" crossorigin="anonymous">
                                        <div class="ml-3" id="userrepo">
                                            <h4 class="font-weight-bold mb-0 text-muted">
                                                ${username}/
                                                    <br> 
                                                <span class="text-dark">${reponame}</span>
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between text-muted">
                                        <small class="font-weight-bold"><i class="fas fa-trophy text-warning">&nbsp;&nbsp;<b id="cntrb"> Rank :</b></i> ${this.getAttribute("rank")}</small>
                                        <small class="font-weight-bold"><i class="fas fa-star text-info">&nbsp;&nbsp; <b id="total">total points :</b></i>  ${this.getAttribute("points")} </small>
                                    </div>
                                </div>
                            </div>`
        }
    }
)