
let allTeams = [];

function loadTeams() {
  fetch("data/teams.json")
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
        <td>${team.group}</td>
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
  const group = document.querySelector('[name=group]').value;
  const members = document.querySelector('[name=members]').value;
  const name = document.querySelector('[name=name]').value;
  const url = document.querySelector('[name=url]').value;

  return {
    group: group,
    members: members,
    name,
    url
  };
}

function saveTeam(team) {
  fetch("data/add-team.json", {
    method: "POST",
    body: JSON.stringify(team)
  })
    .then(r => r.json())
    .then(status => {
      console.warn('status after add', status);
    })
}

function submitTeam() {
  const team = getTeamValues();
  console.warn('add this value in teams.json', JSON.stringify(team))

  saveTeam(team);
}

loadTeams();