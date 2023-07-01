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

let allTeams = [];
let editId;
const membersBreak = ", "; // "<br>"

// for demo purposes...
const isDemo = true || location.host === "nmatei.github.io";
const inlineChanges = isDemo;
if (isDemo) {
  API.READ.URL = "data/teams.json";
  API.DELETE.URL = "data/delete.json";
  API.CREATE.URL = "data/create.json";
  API.UPDATE.URL = "data/update.json";

  API.DELETE.METHOD = "GET";
  API.CREATE.METHOD = "GET";
  API.UPDATE.METHOD = "GET";
}

function $(selector, parent) {
  return (parent || document).querySelector(selector);
}
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function showTeams(teams) {
  const search = document.getElementById("search").value;
  const tbody = document.querySelector("#list tbody");
  // TODO not working if search parts of HTML
  //    < / > chars inside our html, span
  const searchValue = search ? new RegExp(escapeRegExp(search), "gi") : 0;
  tbody.innerHTML = getTeamsAsHtml(teams, searchValue);
}

// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// https://stackoverflow.com/questions/119441/highlight-a-word-with-jquery/32758672#32758672
//    https://markjs.io/
// TODO we can also use <mark> tag
function highlight(text, search) {
  return search
    ? text.replaceAll(search, m => {
        return `<span class="highlight">${m}</span>`;
      })
    : text;
}

// from http://jsfiddle.net/sUK45/
function stringToColour(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}

function getTeamsAsHtml(teams, search) {
  return teams.map(team => getTeamAsHtml(team, search)).join("");
}

function getTeamAsHtml(team, search) {
  const url = team.url;
  const displayUrl = url ? (url.includes("//github.com/") ? url.replace("https://github.com/", "") : "view") : "";
  return `<tr>
    <td style="text-align: center">
      <input type="checkbox" name="selected" value="${team.id}">
    </td>
    <td>
      <span class="circle-bullet" style="background: ${stringToColour(team.promotion)};"></span>
      ${highlight(team.promotion, search)}
    </td>
    <td>${highlight(team.members.split(/\s*,\s*/).join(membersBreak), search)}</td>
    <td>
      ${highlight(team.name, search)}
      ${team.description ? `<p class="description">${team.description}</p>` : ""}
    </td>
    <td>
      <a target="_blank" href="${url}">${highlight(displayUrl, search)}</a>
    </td>
    <td>
      <a href="#" class="delete-row" data-id="${team.id}">&#10006;</a>
      <a href="#" class="edit-row" data-id="${team.id}">&#9998;</a>
    </td>
  </tr>`;
}

function loadList() {
  return fetch(API.READ.URL)
    .then(res => res.json())
    .then(data => {
      allTeams = data;
      showTeams(data);
    });
}

$("#editForm").classList.add("loading-mask");
sleep(isDemo ? 1000 : 0).then(() => {
  loadList().then(() => {
    $("#editForm").classList.remove("loading-mask");
  });
});

function searchTeams(text) {
  text = text.toLowerCase();
  return allTeams.filter(team => {
    return (
      team.members.toLowerCase().indexOf(text) > -1 ||
      team.name.toLowerCase().indexOf(text) > -1 ||
      team.promotion.toLowerCase().indexOf(text) > -1 ||
      team.url.toLowerCase().indexOf(text) > -1
    );
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
  console.info("saving...", team, JSON.stringify(team));

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
        if (inlineChanges) {
          allTeams = [...allTeams, { ...team, id: r.id }];
          showTeams(allTeams);
        } else {
          loadList();
        }
        document.querySelector("#editForm").reset();
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
  console.info("updating...", team, JSON.stringify(team));

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
        if (inlineChanges) {
          allTeams = allTeams.map(t => (t.id === editId ? team : t));
          showTeams(allTeams);
        } else {
          loadList();
        }
        document.querySelector("#editForm").reset();
      }
    });
}

function deleteTeamMember(id) {
  const method = API.UPDATE.METHOD;
  return fetch(API.DELETE.URL, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: method === "GET" ? null : JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(r => {
      if (r.success) {
        if (inlineChanges) {
          allTeams = allTeams.filter(team => team.id !== id);
          showTeams(allTeams);
        } else {
          loadList();
        }
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

function submitTeam(e) {
  e.preventDefault();
  if (editId) {
    updateTeamMember();
  } else {
    saveTeamMember();
  }
}

async function removeSelected() {
  $("#editForm").classList.add("loading-mask");
  const selected = document.querySelectorAll("input[name=selected]:checked");
  // Array.from(selected)
  const ids = [...selected].map(input => input.value);
  const promises = ids.map(id => deleteTeamMember(id));
  promises.push(sleep(2000));
  const statuses = await Promise.allSettled(promises); //.then(() => {})
  await loadList();
  $("#editForm").classList.remove("loading-mask");
}

function addEventListeners() {
  $("#removeSelected").addEventListener("click", removeSelected);

  const search = document.getElementById("search");
  search.addEventListener("input", e => {
    const text = e.target.value;
    const filtrate = searchTeams(text);
    showTeams(filtrate);
  });

  const form = $("#editForm");
  form.addEventListener("submit", submitTeam);
  form.addEventListener("reset", () => {
    console.debug("reset %o", editId);
    editId = undefined;
  });

  const tbody = $("#list tbody");

  $("#selectAll").addEventListener("input", e => {
    tbody.querySelectorAll("input[name=selected]").forEach(check => {
      check.checked = e.target.checked;
    });
  });

  tbody.addEventListener("click", e => {
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
