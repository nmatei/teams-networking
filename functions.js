
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

loadTeams();