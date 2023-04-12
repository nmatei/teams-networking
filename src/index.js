let allTeams = [];

function getTeamsRequest() {
  return fetch("http://localhost:3000/teams-json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => {
    return r.json();
  });
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

function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  }).then(r => r.json());
}

function getTeamAsHTML(team) {
  return `
  <tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>${team.url}</td>
    <td>
      <a data-id="${team.id}" class="link-btn remove-btn">✖</a>
      <a data-id="${team.id}" class="link-btn edit-btn">&#9998;</a>
    </td>
  </tr>`;
}

function showTeams(teams) {
  const html = teams.map(getTeamAsHTML);
  console.warn(html.join("").length);
  $("table tbody").innerHTML = html.join("");
}

function $(selector) {
  return document.querySelector(selector);
}

function formSubmit(e) {
  e.preventDefault();
  //console.warn("submit", e);

  const promotion = $("#promotion").value;
  const members = $("#members").value;
  const projectName = $("#name").value;
  const projectURL = $("#url").value;

  const team = {
    promotion,
    members,
    name: projectName,
    url: projectURL
  };

  createTeamRequest(team).then(status => {
    console.info("status", status);
    window.location.reload();
  });
}

function deleteTeam(id) {
  console.warn("delete", id);
  deleteTeamRequest(id).then(status => {
    console.warn("status", status);
    if (status.success) {
      window.location.reload();
    }
  });
}

function startEditTeam(id) {
  const team = allTeams.find(team => team.id === id);

  $("#promotion").value = team.promotion;
  $("#members").value = team.members;
  $("#name").value = team.name;
  $("#url").value = team.url;
}

function initEvents() {
  $("#editForm").addEventListener("submit", formSubmit);

  $("table tbody").addEventListener("click", e => {
    if (e.target.matches("a.remove-btn")) {
      const id = e.target.dataset.id;
      deleteTeam(id);
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      startEditTeam(id);
    }
  });
}

getTeamsRequest().then(teams => {
  //console.warn(this, window);
  allTeams = teams;
  showTeams(teams);
});

initEvents();
