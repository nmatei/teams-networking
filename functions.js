
let allTeams = [];
let editId;

function loadTeams() {
  fetch("http://localhost:3000/teams")
    .then(r => r.json())
    .then(teams => {
      console.warn('teams', teams);
      allTeams = teams;
      displayTeams(teams);
    })
}

function highlight(text, search) {
  return search ? text.replaceAll(new RegExp(search, "gi"), m => {
    return `<span class="highlight">${m}</span>`;
  }) : text;
}

function getTeamsAsHTML(teams, search) {
  return teams.map(team => {
    return `<tr>
        <td>${highlight(team.promotion, search)}</td>
        <td>${highlight(team.members, search)}</td>
        <td>${highlight(team.name, search)}</td>
        <td>${highlight(team.url, search)}</td>
        <td>
          <a href="#" class="delete-btn" data-id="${team.id}">&#10006;</a>
          <a href="#" class="edit-btn" data-id="${team.id}">&#9998;</a>
        </td>
      </tr>`
  }).join('');
};

function displayTeams(teams) {
  const search = document.getElementById("search").value;
  const html = getTeamsAsHTML(teams, search);

  document.querySelector('#list tbody').innerHTML = html;
}

function getTeamValues() {
  const promotion = document.querySelector('[name=promotion]').value;
  const members = document.querySelector('[name=members]').value;
  const name = document.querySelector('[name=name]').value;
  const url = document.querySelector('[name=url]').value;

  return {
    promotion: promotion,
    members: members,
    name,
    url
  };
}

function setTeamValues(team) {
  console.warn('edit', team);
  document.querySelector('[name=promotion]').value = team.promotion;
  document.querySelector('[name=members]').value = team.members;
  document.querySelector('[name=name]').value = team.name;
  document.querySelector('[name=url]').value = team.url;
}

function saveTeam(team) {
  fetch("http://localhost:3000/teams/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  })
    .then(r => r.json())
    .then(status => {
      if (status.success) {
        loadTeams();
        document.querySelector('form').reset();
      }
    });
}

function deleteTeam(id) {
  fetch("http://localhost:3000/teams/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(status => {
      if (status.success) {
        loadTeams();
      }
    });
}

function updateTeam(team) {
  fetch("http://localhost:3000/teams/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  })
    .then(r => r.json())
    .then(status => {
      if (status.success) {
        loadTeams();
        document.querySelector('form').reset();
        editId = 0;
      }
    });
}

function editTeam(id) {
  editId = id;
  const team = allTeams.find(team => team.id === id);
  setTeamValues(team);
}

function submitTeam() {
  const team = getTeamValues();
  if (editId) {
    team.id = editId;
    updateTeam(team);
  } else {
    saveTeam(team);
  }
}

loadTeams();

document.querySelector('#list tbody').addEventListener("click", e => {
  if (e.target.matches("a.delete-btn")) {
    const id = e.target.getAttribute("data-id");
    deleteTeam(id);
  } else if (e.target.matches("a.edit-btn")) {
    const id = e.target.getAttribute("data-id");
    editTeam(id);
  }
});

document.getElementById("search").addEventListener("input", e => {
  const text = e.target.value.toLowerCase();
  const filtered = allTeams.filter(team => {
    return team.members.toLowerCase().includes(text) || 
      team.name.toLowerCase().includes(text) ||
      team.promotion.toLowerCase().includes(text) ||
      team.url.toLowerCase().includes(text);
  });
  displayTeams(filtered);
});
