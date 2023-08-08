//import { debounce } from "lodash"; // imports too much code...
import debounce from "lodash/debounce"; // improved import
import "./style.css";
import { $, mask, unmask } from "./utilities";
import { loadTeamsRequest, createTeamRequest, deleteTeamRequest, updateTeamRequest } from "./middleware";

// global variables
let editId;
let allTeams = [];

const formSelector = "#teamsForm";

function getTeamAsHTML({ id, promotion, members, name, url }) {
  const displayUrl = url.startsWith("https://github.com/") ? url.substring(19) : url;
  return `<tr>
    <td class="select-row">
      <input type="checkbox" name="selected" value="${id}"/>
    </td>
    <td>${promotion}</td>
    <td>${members}</td>
    <td>${name}</td>
    <td>
      <a href="${url}" target="_blank">${displayUrl}</a>
    </td>
    <td>
      <button type="button" data-id="${id}" class="action-btn edit-btn">&#9998;</button>
      <button type="button" data-id="${id}" class="action-btn delete-btn">♻</button>
    </td>
  </tr>`;
}

function areTeamsEquals(renderedTeams, teams) {
  if (renderedTeams === teams) {
    return true;
  }
  if (renderedTeams.length === teams.length) {
    const eq = renderedTeams.every((team, i) => team === teams[i]);
    if (eq) {
      return true;
    }
  }
  return false;
}

let renderedTeams = [];
function renderTeams(teams) {
  if (areTeamsEquals(renderedTeams, teams)) {
    return;
  }
  renderedTeams = teams;
  const teamsHTML = teams.map(getTeamAsHTML);
  $("#teamsTable tbody").innerHTML = teamsHTML.join("");
}

async function loadTeams() {
  const teams = await loadTeamsRequest();
  allTeams = teams;
  renderTeams(teams);
}

function updateTeam(teams, team) {
  return teams.map(t => {
    if (t.id === team.id) {
      return {
        ...t,
        ...team
      };
    }
    return t;
  });
}

async function onSubmit(e) {
  e.preventDefault();

  mask(formSelector);
  const team = getTeamValues();

  if (editId) {
    team.id = editId;
    const status = await updateTeamRequest(team);
    if (status.success) {
      allTeams = updateTeam(allTeams, team);
      renderTeams(allTeams);
      $("#teamsForm").reset();
    }
    unmask(formSelector);
  } else {
    createTeamRequest(team).then(status => {
      if (status.success) {
        team.id = status.id;
        //allTeams = allTeams.map(team => team);
        //allTeams.push(team);
        allTeams = [...allTeams, team];
        renderTeams(allTeams);
        $("#teamsForm").reset();
      }
      unmask(formSelector);
    });
  }
}

function startEdit(id) {
  editId = id;
  const team = allTeams.find(team => team.id === id);
  setTeamValues(team);
}

function setTeamValues({ promotion, members, name, url }) {
  $("input[name=promotion]").value = promotion;
  $("input[name=members]").value = members;
  $("input[name=name]").value = name;
  $("input[name=url]").value = url;
}

function getTeamValues() {
  const promotion = $("input[name=promotion]").value;
  const members = $("input[name=members]").value;
  const name = $("input[name=name]").value;
  const url = $("input[name=url]").value;
  return {
    promotion: promotion,
    members: members,
    name,
    url
  };
}

function filterElements(teams, search) {
  search = search.toLowerCase();
  return teams.filter(({ promotion, members, name, url }) => {
    return (
      promotion.toLowerCase().includes(search) ||
      members.toLowerCase().includes(search) ||
      name.toLowerCase().includes(search) ||
      url.toLowerCase().includes(search)
    );
  });
}

async function removeSelected() {
  mask("#main");
  const selected = document.querySelectorAll("input[name=selected]:checked");
  const ids = [...selected].map(input => input.value);
  const promises = ids.map(id => deleteTeamRequest(id));
  const statuses = await Promise.allSettled(promises);
  await loadTeams();
  unmask("#main");
}

function initEvents() {
  $("#removeSelected").addEventListener("click", removeSelected);

  $("#search").addEventListener(
    "input",
    debounce(e => {
      const search = e.target.value;
      const teams = filterElements(allTeams, search);
      renderTeams(teams);
    }, 200)
  );

  $("#selectAll").addEventListener("input", e => {
    document.querySelectorAll("input[name=selected]").forEach(check => {
      check.checked = e.target.checked;
    });
  });

  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsForm").addEventListener("reset", () => {
    editId = undefined;
  });

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("button.delete-btn")) {
      const { id } = e.target.dataset;
      mask(formSelector);
      deleteTeamRequest(id).then(status => {
        if (status.success) {
          allTeams = allTeams.filter(team => team.id !== id);
          renderTeams(allTeams);
        }
        unmask(formSelector);
      });
    } else if (e.target.matches("button.edit-btn")) {
      const { id } = e.target.dataset;
      startEdit(id);
    }
  });
}

initEvents();

mask(formSelector);
loadTeams().then(() => {
  unmask(formSelector);
});
