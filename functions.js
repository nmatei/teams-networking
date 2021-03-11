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

let editId;

function showTeams(persons) {
    const tbody = document.querySelector('#list tbody');
    tbody.innerHTML = getPersonsHtml(persons);
}

function getPersonsHtml (persons) {
    return persons.map(getPersonHtml).join("");
}

function getPersonHtml (team) {
    const url = team.url;
    return `<tr>
        <td>${team.group}</td>    
        <td>${team.members.split(/\s*,\s*/).join("<br>")}</td>
        <td>${team.name}</td>
        <td><a target="_blank" href="${url}">Github</a></td>
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
    return allPersons.filter(team => {
        return team.members.toLowerCase().indexOf(text) > -1 ||
            team.name.toLowerCase().indexOf(text) > -1;
    });
}

function saveTeamMember() {
    const members = document.querySelector("#list input[name=members]").value;
    const name = document.querySelector("input[name=name]").value;
    const url = document.querySelector("input[name=url]").value;
    
    const team = {
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
    const members = document.querySelector("#list input[name=members]").value;
    const name = document.querySelector("input[name=name]").value;
    const url = document.querySelector("input[name=url]").value;
    
    const team = {
        id: editId,
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
    
    const members = document.querySelector("#list input[name=members]");
    const name = document.querySelector("input[name=name]");
    const url = document.querySelector("input[name=url]");

    members.value = team.members;
    name.value = team.name;
    url.value = team.url;
}

function addEventListeners() {
    const search = document.getElementById('search');
    search.addEventListener("input", e => {
        const text = e.target.value;
        const filtrate = searchTeams(text);
        showTeams(filtrate);
    });
    
    const saveBtn = document.querySelector("#list tfoot button");
    saveBtn.addEventListener("click", () => {
        if (editId) {
            updateTeamMember();
        } else {
            saveTeamMember();
        }
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
