let allTeams = [];
var editId;

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

function deleteTeamRequest(id, successDelete) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(status => {
      console.warn("before remove ", status);
      if (typeof successDelete === "function") {
        const r = successDelete(status);
        console.info("raspuns", r);
      }
      return status;
    });
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

  if (editId) {
    team.id = editId;
    console.warn("update...?", editId, team);
    updateTeamRequest(team).then(status => {
      console.info("updated", status);
      if (status.success) {
        //window.location.reload();
        loadTeams().then(() => {
          $("#editForm").reset();
        });
      }
    });
  } else {
    createTeamRequest(team).then(status => {
      console.info("created", status);
      if (status.success) {
        // window.location.reload();
        loadTeams(() => {
          $("#editForm").reset();
        });
      }
    });
  }
}

function deleteTeam(id) {
  console.warn("delete", id);
  deleteTeamRequest(id, status => {
    console.info("callback success", status);
    return id;
  }).then(status => {
    console.warn("status", status);
    if (status.success) {
      //window.location.reload();
      loadTeams();
    }
  });
}

function startEditTeam(id) {
  editId = id;
  const team = allTeams.find(team => team.id === id);

  $("#promotion").value = team.promotion;
  $("#members").value = team.members;
  $("#name").value = team.name;
  $("#url").value = team.url;
}

function searchTeams(teams, search) {
  search = search.toLowerCase();
  return teams.filter(team => {
    return (
      team.members.toLowerCase().includes(search) ||
      team.name.toLowerCase().includes(search) ||
      team.promotion.toLowerCase().includes(search) ||
      team.url.toLowerCase().includes(search)
    );
  });
}

function initEvents() {
  const form = $("#editForm");
  form.addEventListener("submit", formSubmit);
  form.addEventListener("reset", () => {
    editId = undefined;
  });

  $("#search").addEventListener("input", e => {
    //const search = $("#search").value;
    const search = e.target.value;
    console.info("search", search);
    const teams = searchTeams(allTeams, search);
    showTeams(teams);
  });

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

function loadTeams(cb) {
  return getTeamsRequest().then(teams => {
    //console.warn(this, window);
    allTeams = teams;
    showTeams(teams);
    if (typeof cb === "function") {
      cb(teams);
    }
    return teams;
  });
}

loadTeams();

initEvents();
