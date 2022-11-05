// import { debounce } from "lodash";
// import debounce from "lodash/debounce";
import { $, debounce } from "./utilities";

debounce;

let allTeams = [];
let editId;

function getTeamHTML({ id, url, promotion, name, members }) {
  return `
  <tr>
    <td>${promotion}</td>
    <td>${members}</td>
    <td>${name}</td>
    <td>
      <a href="${url}" target="_blank">open</a>
    </td>
    <td>
      <a href="#" data-id="${id}" class="delete-btn">✖</a>
      <a href="#" data-id="${id}" class="edit-btn">&#9998;</a>
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
    .then(r => r.json())
    .then(teams => {
      allTeams = teams;
      displayTeams(teams);
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

function removeTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
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

function getFormValues() {
  const promotion = $("input[name=promotion]").value;
  const members = $("input[name=members]").value;
  const name = $("input[name=name]").value;
  const url = $("input[name=url]").value;

  const team = {
    promotion: promotion,
    members: members,
    name: name,
    url: url
  };
  return team;
}

function setFormValues({ promotion, members, name, url }) {
  $("input[name=promotion]").value = promotion;
  $("input[name=members]").value = members;
  $("input[name=name]").value = name;
  $("input[name=url]").value = url;
}

function submitForm(e) {
  e.preventDefault();

  const team = getFormValues();

  if (editId) {
    team.id = editId;
    updateTeamRequest(team).then(status => {
      if (status.success) {
        $("#editForm").reset();
        loadTeams();
      }
    });
  } else {
    createTeamRequest(team).then(({ success }) => {
      if (success) {
        $("#editForm").reset();
        loadTeams();
      }
    });
  }
}

function startEditTeam(id) {
  const team = allTeams.find(team => team.id === id);
  setFormValues(team);
  editId = id;
}

function initEvents() {
  $("#search").addEventListener(
    "input",
    debounce(e => {
      const search = e.target.value.toLowerCase();
      const teams = allTeams.filter(team => {
        return (
          team.promotion.toLowerCase().includes(search) ||
          team.members.toLowerCase().includes(search) ||
          team.name.toLowerCase().includes(search)
        );
      });
      displayTeams(teams);
    }, 400)
  );

  const form = $("#editForm");
  form.addEventListener("submit", submitForm);
  form.addEventListener("reset", () => {
    editId = undefined;
  });

  form.querySelector("tbody").addEventListener("click", e => {
    if (e.target.matches("a.delete-btn")) {
      const id = e.target.getAttribute("data-id");
      removeTeamRequest(id).then(status => {
        if (status.success) {
          loadTeams();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.getAttribute("data-id");
      startEditTeam(id);
    }
  });
}

loadTeams();
initEvents(10);
