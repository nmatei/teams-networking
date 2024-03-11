import "./style.css";

let allTeams = [];

function $(selector) {
  return document.querySelector(selector);
}

function createTeamRequest(team) {
  fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  });
}

function deleteTeamRequest(id) {
  fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  });
}

function updateTeamRequest(team) {
  fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  });
}

function getTeamAsHTML(team) {
  return `<tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>${team.url}</td>
    <td>
      <a href="#" data-id="${team.id}" class="delete-btn">✖</a> 
      <a href="#" data-id="${team.id}" class="edit-btn">&#9998;</a> 
    </td>
  </tr>`;
}

function renderTeams(teams) {
  // console.warn("render", teams);
  const teamsHTML = teams.map(getTeamAsHTML);
  // console.info(teamsHTML);

  $("#teamsTable tbody").innerHTML = teamsHTML.join("");
}

function loadTeams() {
  const promise = fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      allTeams = teams;
      renderTeams(teams);
      return teams;
    });
}

function getFormValues() {
  return {
    promotion: $("input[name=promotion]").value,
    members: $("input[name=members]").value,
    name: $("input[name=name]").value,
    url: $("input[name=url]").value
  };
}

function onSubmit(e) {
  e.preventDefault();
  let team = getFormValues();
  createTeamRequest(team);
  window.location.reload();
}

function startEdit(id) {
  const team = allTeams.find(team => {
    return id === team.id;
  });
  console.warn("click on edit %o", id, team);
}

function initEvents() {
  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      const id = e.target.dataset.id;
      deleteTeamRequest(id);
      window.location.reload();
    } else if (e.target.matches("a.edit-btn")) {
      //const id = e.target.getAttribute("data-id");
      const id = e.target.dataset.id;
      startEdit(id);
    }
  });
}

initEvents();
loadTeams();
