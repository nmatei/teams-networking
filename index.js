function getTeamsRequest() {
  return fetch("http://localhost:3000/teams-json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => {
    return r.json();
  });
}

function getTeamAsHTML(team) {
  return `
  <tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>${team.url}</td>
  </tr>`;
}

function showTeams(teams) {
  const html = teams.map(getTeamAsHTML);
  document.querySelector("table tbody").innerHTML = html.join("");
}

getTeamsRequest().then((teams) => {
  showTeams(teams);
});
