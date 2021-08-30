
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
        <td>
          <a href="#" class="delete-btn" data-id="${team.id}">&#10006;</a>
          <a href="#" class="edit-btn">&#9998;</a>
        </td>
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
      if (status.success) {
        loadTeams();
        document.querySelector('form').reset();
      }
    });
}

function deleteTeam(id) {
  fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(status => {
      if (status.success) {
        loadTeams();
      }
    });
}

function submitTeam() {
  const team = getTeamValues();
  saveTeam(team);
}

loadTeams();

document.querySelector('#list tbody').addEventListener("click", e => {
  if (e.target.matches("a.delete-btn")) {
    const id = e.target.getAttribute("data-id");
    deleteTeam(id);
  }
});