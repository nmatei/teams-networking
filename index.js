function $(selector) {
  return document.querySelector(selector);
}

function getTeamHTML(team) {
  return `
  <tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>
      <a href="${team.url}" target="_blank">open</a>
    </td>
    <td>
      <a href="#" data-id="${team.id}" class="delete-btn">✖</a>
    </td>
  </tr>`;
}

function displayTeams(teams) {
  const teamsHTML = teams.map(getTeamHTML);

  // afisare
  $("table tbody").innerHTML = teamsHTML.join("");
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then((r) => r.json())
    .then((teams) => {
      displayTeams(teams);
    });
}

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  });
}

function removeTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  }).then((r) => r.json());
}

function submitForm(e) {
  e.preventDefault();
  const promotion = $("input[name=promotion]").value;
  const members = $("input[name=members]").value;
  const name = $("input[name=name]").value;
  const url = $("input[name=url]").value;

  const team = {
    promotion: promotion,
    members: members,
    name: name,
    url: url,
  };

  createTeamRequest(team)
    .then((r) => r.json())
    .then((status) => {
      console.warn("status", status);
      if (status.success) {
        location.reload();
      }
    });
}

function initEvents() {
  const form = document.getElementById("editForm");
  form.addEventListener("submit", submitForm);

  form.querySelector("tbody").addEventListener("click", (e) => {
    if (e.target.matches("a.delete-btn")) {
      const id = e.target.getAttribute("data-id");
      removeTeamRequest(id).then((status) => {
        if (status.success) {
          loadTeams();
        }
      });
    }
  });
}

loadTeams();
initEvents();
