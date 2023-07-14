import "./style.css";

let allTeams = [];
let editId;

function $(selector) {
  return document.querySelector(selector);
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

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function getTeamAsHTML(team) {
  const url = team.url;
  const displayUrl = url.startsWith("https://github.com/") ? url.substring(19) : url;
  return `<tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>
      <a href="${url}" target="_blank">${displayUrl}</a>
    </td>
    <td>
      <button type="button" data-id="${team.id}" class="action-btn edit-btn">&#9998;</button>
      <button type="button" data-id="${team.id}" class="action-btn delete-btn">♻</button>
    </td>
  </tr>`;
}

function getTeamAsHTMLInputs(team) {
  return `<tr>
    <td>
      <input value="${team.promotion}" type="text" name="promotion" placeholder="Enter Promotion" required/>
    </td>
    <td>
      <input value="${team.members}" type="text" name="members" placeholder="Enter Members" required />
    </td>
    <td>
      <input value="${team.name}" type="text" name="name" placeholder="Enter Name" required />
    </td>
    <td>
      <input value="${team.url}" type="text" name="url" placeholder="Enter URL" required />
    </td>
    <td>
      <button type="submit" class="action-btn" title="Save">💾</button>
      <button type="reset" class="action-btn" title="Cancel">✖</button>
    </td>
  </tr>`;
}

function renderTeams(teams, editId) {
  const htmlTeams = teams.map(team => {
    return team.id === editId ? getTeamAsHTMLInputs(team) : getTeamAsHTML(team);
  });
  //console.warn(htmlTeams);
  $("#teamsTable tbody").innerHTML = htmlTeams.join("");
  addTitlesToOverflowCells();
}

function addTitlesToOverflowCells() {
  const cells = document.querySelectorAll("#teamsTable td");
  cells.forEach(cell => {
    cell.title = cell.offsetWidth < cell.scrollWidth ? cell.textContent : "";
  });
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      allTeams = teams;
      renderTeams(teams);
    });
}

function getTeamValues(parent) {
  const promotion = $(`${parent} input[name=promotion]`).value;
  const members = $(`${parent} input[name=members]`).value;
  const name = $(`${parent} input[name=name]`).value;
  const url = $(`${parent} input[name=url]`).value;
  const team = {
    promotion: promotion,
    members: members,
    name,
    url
  };
  return team;
}

function onSubmit(e) {
  e.preventDefault();

  console.warn("update or create?", editId);

  const team = getTeamValues(editId ? "tbody" : "tfoot");

  if (editId) {
    team.id = editId;
    console.warn("update...", team);
    updateTeamRequest(team).then(status => {
      console.warn("updated", status);
      if (status.success) {
        //window.location.reload();
        loadTeams();
        //$("#teamsForm").reset();
        setInputsDisabled(false);
        editId = "";
      }
    });
  } else {
    createTeamRequest(team).then(status => {
      console.warn("created", status);
      if (status.success) {
        //window.location.reload();
        loadTeams();
        $("#teamsForm").reset();
      }
    });
  }
}

function startEdit(id) {
  editId = id;
  console.warn("edit... %o", id, allTeams);
  //const team = allTeams.find(team => team.id === id);
  renderTeams(allTeams, id);

  setInputsDisabled(true);
}

function setInputsDisabled(disabled) {
  document.querySelectorAll("tfoot input").forEach(input => {
    input.disabled = disabled;
  });
}

function filterElements(teams, search) {
  search = search.toLowerCase();
  return teams.filter(team => {
    //console.info("search %o in %o", search, team.promotion);
    return (
      team.promotion.toLowerCase().includes(search) ||
      team.members.toLowerCase().includes(search) ||
      team.name.toLowerCase().includes(search) ||
      team.url.toLowerCase().includes(search)
    );
  });
}

function initEvents() {
  $("#search").addEventListener("input", e => {
    const search = e.target.value;
    const teams = filterElements(allTeams, search);
    console.info("search", search, teams);
    renderTeams(teams);
  });

  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsForm").addEventListener("reset", e => {
    console.info("reset", editId);
    if (editId) {
      // console.warn("cancel edit");
      renderTeams(allTeams);
      setInputsDisabled(false);
      editId = "";
    }
  });

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("button.delete-btn")) {
      const id = e.target.dataset.id;
      //console.warn("delete... %o", id);
      deleteTeamRequest(id).then(status => {
        //console.info("delete status %o", status);
        if (status.success) {
          //window.location.reload();
          loadTeams();
        }
      });
    } else if (e.target.matches("button.edit-btn")) {
      const id = e.target.dataset.id;
      startEdit(id);
    }
  });
}

loadTeams();
initEvents();
