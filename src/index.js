let allTeams = [];

fetch("http://localhost:3000/teams-json", {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(r => r.json())
  .then(teams => {
    //window.teams = teams;
    allTeams = teams;
    console.info(teams);
    displayTeams(teams);
  });

function createTeamRequest() {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      promotion: document.getElementById("promotion").value,
      members: document.getElementById("members").value,
      name: document.getElementById("name").value,
      url: document.getElementById("url").value
    })
  }).then(r => r.json());
}

function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  }).then(r => r.json());
}

function displayTeams(teams) {
  const teamsHTML = teams.map(
    team => `
      <tr>
        <td>${team.promotion}</td>
        <td>${team.members}</td>
        <td>${team.name}</td>
        <td>${team.url}</td>
        <td>
          <a data-id="${team.id}" class="remove-btn">✖</a>
          <a data-id="${team.id}" class="edit-btn">&#9998;</a>
        </td>
      </tr>`
  );

  document.querySelector("#teams tbody").innerHTML = teamsHTML.join("");
}

function onSubmit(e) {
  e.preventDefault();

  createTeamRequest().then(status => {
    if (status.success) {
      window.location.reload();
    }
  });
}

// TODO - rename
function edit(id) {
  const team = allTeams.find(team => team.id === id);
  console.warn("edit", id, team);

  document.getElementById("promotion").value = "promotion";
  document.getElementById("members").value = "members";
  document.getElementById("name").value = "name";
  document.getElementById("url").value = "url";
}

function initEvents() {
  const form = document.getElementById("editForm");
  form.addEventListener("submit", onSubmit);

  document.querySelector("#teams tbody").addEventListener("click", e => {
    if (e.target.matches("a.remove-btn")) {
      const id = e.target.dataset.id;
      deleteTeamRequest(id).then(status => {
        if (status.success) {
          window.location.reload();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      edit(id);
    }
  });
}

initEvents();
