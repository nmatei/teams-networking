const API = {
  CREATE: {
    URL: "http://localhost:3000/teams/create",
    METHOD: "POST"
  },
  READ: {
    URL: "http://localhost:3000/teams",
    METHOD: "GET"
  },
  UPDATE: {
    URL: "http://localhost:3000/teams/update",
    METHOD: "PUT"
  },
  DELETE: {
    URL: "http://localhost:3000/teams/delete",
    METHOD: "DELETE"
  }
};

let editId;
const membersBreak = ", "; // "<br>"

// for demo purposes...
if (true || location.host === "nmatei.github.io") {
  API.READ.URL = "data/teams.json";
  API.DELETE.URL = "data/delete.json";
  API.CREATE.URL = "data/create.json";
  API.UPDATE.URL = "data/update.json";

  API.READ.METHOD = "GET";
  API.DELETE.METHOD = "GET";
  API.CREATE.METHOD = "GET";
  API.UPDATE.METHOD = "GET";
}

function showTeams(persons) {
  const search = document.getElementById("search").value;
  const tbody = document.querySelector('#list tbody');
  const searchValue = search ? new RegExp(search, "gi") : 0;
  tbody.innerHTML = getTeamsAsHtml(persons, searchValue);
}

function highlight(text, search) {
  return search ? text.replaceAll(search, m => {
    return `<span class="highlight">${m}</span>`;
  }) : text;
}

// from http://jsfiddle.net/sUK45/
function stringToColour(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function getTeamsAsHtml(teams, search) {
  return teams.map(team => getTeamAsHtml(team, search)).join("");
}

function getTeamAsHtml(team, search) {
  const url = team.url;
  const displayUrl = url ? url.replace('https://github.com/', '') : "Github";
  return `<tr>
        <td>
          <span class="circle-bullet" style="background: ${stringToColour(team.promotion)};"></span>
          ${highlight(team.promotion, search)}
        </td>
        <td>${highlight(team.members.split(/\s*,\s*/).join(membersBreak), search)}</td>
        <td>${highlight(team.name, search)}</td>
        <td>
          <a target="_blank" href="${url}">${highlight(displayUrl, search)}</a>
        </td>
        <td>
            <a href="#" class="delete-row" data-id="${team.id}">&#10006;</a>
            <a href="#" class="edit-row" data-id="${team.id}">&#9998;</a>
        </td>
    </tr>`;
}

let allTeams = [];

function loadList() {
  fetch(API.READ.URL)
    .then(res => res.json())
    .then(data => {
      allTeams = data;
      showTeams(data);
    });
}

loadList();

function searchTeams(text) {
  text = text.toLowerCase();
  return allTeams.filter(team => {
    return team.members.toLowerCase().indexOf(text) > -1 ||
      team.name.toLowerCase().indexOf(text) > -1 ||
      team.promotion.toLowerCase().indexOf(text) > -1 ||
      team.url.toLowerCase().indexOf(text) > -1;
  });
}

function saveTeamMember() {
  const promotion = document.querySelector("#list input[name=promotion]").value;
  const members = document.querySelector("#list input[name=members]").value;
  const name = document.querySelector("input[name=name]").value;
  const url = document.querySelector("input[name=url]").value;

  const team = {
    promotion,
    members,
    name,
    url
  };
  console.info('saving...', team, JSON.stringify(team));

  const method = API.CREATE.METHOD;
  fetch(API.CREATE.URL, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: method === "GET" ? null : JSON.stringify(team)
  })
    .then(res => res.json())
    .then(r => {
      console.warn(r);
      if (r.success) {
        loadList();
      }
    });
}

function updateTeamMember() {
  const promotion = document.querySelector("#list input[name=promotion]").value;
  const members = document.querySelector("#list input[name=members]").value;
  const name = document.querySelector("input[name=name]").value;
  const url = document.querySelector("input[name=url]").value;

  const team = {
    id: editId,
    promotion,
    members,
    name,
    url
  };
  console.info('updating...', team, JSON.stringify(team));

  const method = API.UPDATE.METHOD;
  fetch(API.UPDATE.URL, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: method === "GET" ? null : JSON.stringify(team)
  })
    .then(res => res.json())
    .then(r => {
      if (r.success) {
        loadList();
      }
    });
}

function deleteTeamMember(id) {
  const method = API.UPDATE.METHOD;
  fetch(API.DELETE.URL, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: method === 'GET' ? null : JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(r => {
      if (r.success) {
        loadList();
      }
    });
}

function populateCurrentMember(id) {
  var team = allTeams.find(team => team.id === id);

  editId = id;

  const promotion = document.querySelector("#list input[name=promotion]");
  const members = document.querySelector("#list input[name=members]");
  const name = document.querySelector("input[name=name]");
  const url = document.querySelector("input[name=url]");

  promotion.value = team.promotion;
  members.value = team.members;
  name.value = team.name;
  url.value = team.url;
}

function submitTeam() {
  if (editId) {
    updateTeamMember();
  } else {
    saveTeamMember();
  }
}

function addEventListeners() {
  const search = document.getElementById('search');
  search.addEventListener("input", e => {
    const text = e.target.value;
    const filtrate = searchTeams(text);
    showTeams(filtrate);
  });

  const table = document.querySelector("#list tbody");
  table.addEventListener("click", (e) => {
    const target = e.target;
    if (target.matches("a.delete-row")) {
      const id = target.getAttribute("data-id");
      deleteTeamMember(id);
    } else if (target.matches("a.edit-row")) {
      const id = target.getAttribute("data-id");
      populateCurrentMember(id);
    }
  });
}

addEventListeners();
