import "./style.css";

function getTeamAsHTML(team) {
  return `<tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>${team.url}</td>
    <td>x</td>
  </tr>`;
}

function renderTeams(teams) {
  const teamsHTML = teams.map(getTeamAsHTML);

  document.querySelector("#teamsTable tbody").innerHTML = teamsHTML.join("");
}

function loadTeams() {
  fetch("teams.json")
    .then(r => r.json())
    .then(teams => {
      renderTeams(teams);
    });
}

loadTeams();
