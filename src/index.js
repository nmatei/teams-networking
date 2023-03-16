let allTeams = [];
let editId;

function loadTeamsRequest() {
  return fetch("http://localhost:3000/teams-json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
}

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
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

function readTeam() {
  return {
    promotion: document.getElementById("promotion").value,
    members: document.getElementById("members").value,
    name: document.getElementById("name").value,
    url: document.getElementById("url").value
  };
}

function writeTeam(team) {
  document.getElementById("promotion").value = team.promotion;
  document.getElementById("members").value = team.members;
  document.getElementById("name").value = team.name;
  document.getElementById("url").value = team.url;
}

function getTeamsHTML(teams) {
  return teams
    .map(
      team => `
      <tr>
        <td>${team.promotion}</td>
        <td>${team.members}</td>
        <td>${team.name}</td>
        <td>
          <a href="${team.url}" target="_blank">${team.url.replace("https://github.com/", "")}</a>
        </td>
        <td>
          <a data-id="${team.id}" class="remove-btn">✖</a>
          <a data-id="${team.id}" class="edit-btn">&#9998;</a>
        </td>
      </tr>`
    )
    .join("");
}

function displayTeams(teams) {
  document.querySelector("#teams tbody").innerHTML = getTeamsHTML(teams);
}

function loadTeams() {
  loadTeamsRequest().then(teams => {
    //window.teams = teams;
    allTeams = teams;
    console.info(teams);
    displayTeams(teams);
  });
}

function onSubmit(e) {
  e.preventDefault();
  const team = readTeam();
  if (editId) {
    team.id = editId;
    updateTeamRequest(team).then(status => {
      if (status.success) {
        // load new teams...?
        loadTeams();
        // TODO don't load teams
        //displayTeams(allTeams);
        e.target.reset();
      }
    });
  } else {
    createTeamRequest(team).then(status => {
      if (status.success) {
        // 1. adaugam datele in table...
        //   1.0. adaug id in team
        team.id = status.id;
        //   1.1. addaug team in allTeams
        allTeams.push(team);
        //allTeams = [...allTeams, team]
        //   1.2. apelam displayTeams(allTeams);
        displayTeams(allTeams);
        // 2. stergem datele din inputuri
        //writeTeam({ promotion: "", name: "", url: "", members: "" });
        e.target.reset();
      }
    });
  }
}

function prepareEdit(id) {
  const team = allTeams.find(team => team.id === id);
  editId = id;

  writeTeam(team);
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
      prepareEdit(id);
    }
  });
}

loadTeams();
initEvents();
