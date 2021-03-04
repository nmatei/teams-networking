let allTeams = [];

function getHtmlTeams(teams) {
   return teams.map(team => {
        return `<tr>
            <td>${team.members}</td>
            <td>${team.name}</td>
            <td>${team.url}</td>
            <td>&#10006; &#9998;</td>
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

function addTeam(team) {
    fetch("add.json", {
        method: "POST",
        body: JSON.stringify(team)
    })
        .then(r => r.json())
        .then(status => {
            console.warn('status', status);
        });
}

function saveTeam() {
    const members = document.querySelector("input[name=members]").value;
    const name = document.querySelector("input[name=name]").value;
    const url = document.querySelector("input[name=url]").value;

    const team = {
        name: name,
        members: members,
        url: url
    };

    addTeam(team);
}