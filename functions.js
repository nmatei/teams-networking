let allTeams = [];

function getHtmlTeams(teams) {
  return teams.map(team => {
    return `<tr>
            <td>${team.members}</td>
            <td>${team.name}</td>
            <td>${team.url}</td>
            <td>
              <a href="#" class="remove-btn" data-id="${team.id}">&#10006;</a>
              <a href="#" class="edit-btn" data-id="${team.id}">&#9998;</a>
            </td>
        </tr>`
  }).join("")
}

function showTeams(teams) {
  const html = getHtmlTeams(teams);

  const tbody = document.querySelector("tbody");
  tbody.innerHTML = html;
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      allTeams = teams;
      showTeams(teams);
    });
}
loadTeams();

function addTeam(team) {
  fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    body: JSON.stringify(team),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(r => r.json())
    .then(status => {
      if (status.success) {
        window.location.reload();
      }
    });
}

function removeTeam(id) {
  fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  })
    .then(r => r.json())
    .then(status => {
      if (status.success) {
        loadTeams();
      }
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

document.querySelector("table tbody").addEventListener("click", e => {
  if (e.target.matches("a.remove-btn")) {
    const id = e.target.getAttribute('data-id');
    removeTeam(id);
  } else if (e.target.matches("a.edit-btn")) {
    const id = e.target.getAttribute('data-id');
    console.warn('edit?', id);
  }
})