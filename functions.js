let allTeams = [];

function getHtmlTeams(teams) {
   return teams.map(team => {
        return `<tr>
            <td>${team.members}</td>
            <td>${team.name}</td>
            <td>${team.url}</td>
        </tr>`
    }).join("")
}

function showTeams(teams) {
    const html = getHtmlTeams(teams);
    
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = html;
}

fetch("teams.json")
    .then(r => r.json())
    .then(teams => {
        allTeams = teams;
        showTeams(teams);
    });
