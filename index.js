fetch("teams.json")
  .then((r) => r.json())
  .then((teams) => {
    displayTeams(teams);
  });

function displayTeams(teams) {
  const teamsHTML = teams.map(
    (team) => `
      <tr>
        <td>${team.promotion}</td>
        <td>${team.members}</td>
        <td>${team.name}</td>
        <td>${team.url}</td>
        <td></td>
      </tr>`
  );

  document.querySelector("#teams tbody").innerHTML = teamsHTML.join("");
}
