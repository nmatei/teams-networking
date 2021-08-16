
let allTeams = [];

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      console.warn('teams', teams);
      allTeams = teams;
      displayTeams(teams);
    })
}

function getTeamsAsHTML(teams) {
  return teams.map(team => {
    return `<tr>
        <td>${team.promotion}</td>
        <td>${team.members}</td>
        <td>${team.name}</td>
        <td>${team.url}</td>
        <td>...</td>
      </tr>`
  }).join('');
};

function displayTeams(teams) {
  const html = getTeamsAsHTML(teams);

  document.querySelector('#list tbody').innerHTML = html;
}

function getTeamValues() {
  const promotion = document.querySelector('[name=promotion]').value;
  const members = document.querySelector('[name=members]').value;
  const name = document.querySelector('[name=name]').value;
  const url = document.querySelector('[name=url]').value;

  return {
    promotion: promotion,
    members: members,
    name,
    url
  };
}

function saveTeam(team) {
  fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  })
    .then(r => r.json())
    .then(status => {
      console.warn('status after add', status);
      if (status.success) {
        window.location.reload();
      }
    })
}

function submitTeam() {
  const team = getTeamValues();
  console.warn('add this value in teams.json', JSON.stringify(team))

  saveTeam(team);
}

loadTeams();