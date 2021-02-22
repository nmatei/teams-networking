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
    API.READ.URL = "team.json";
}

let editId;

function insertPersons(persons) {
    const tbody = document.querySelector('#list tbody');
    tbody.innerHTML = getPersonsHtml(persons);
}

function getPersonsHtml (persons) {
    return persons.map(getPersonHtml).join("");
}

function getPersonHtml (person) {
    const projectUrl = person.projectUrl;
    return `<tr>
        <td>${person.members.split(/\s*,\s*/).join("<br>")}</td>
        <td>${person.projectName}</td>
        <td><a target="_blank" href="${projectUrl}">Github</a></td>
        <td>
            <a href="#" class="delete-row" data-id="${person.id}">&#10006;</a>
            <a href="#" class="edit-row" data-id="${person.id}">&#9998;</a>
        </td>
    </tr>`;
}

let allPersons = [];

function loadList() {
    fetch(API.READ.URL)
        .then(res => res.json())
        .then(data => {
            allPersons = data;
            insertPersons(data);
        });
}

loadList();

function searchPersons(text) {
    text = text.toLowerCase();
    return allPersons.filter(person => {
        return person.members.toLowerCase().indexOf(text) > -1 ||
            person.projectName.toLowerCase().indexOf(text) > -1;
    });
}

function saveTeamMember() {
    const members = document.querySelector("#list input[name=members]").value;
    const projectName = document.querySelector("input[name=projectName]").value;
    const projectUrl = document.querySelector("input[name=projectUrl]").value;
    
    const person = {
        members,
        projectName,
        projectUrl
    };
    console.info('saving...', person, JSON.stringify(person));

    fetch(API.CREATE.URL, {
        method: API.CREATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.CREATE.METHOD === "GET" ? null : JSON.stringify(person)
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
    const projectName = document.querySelector("input[name=projectName]").value;
    const projectUrl = document.querySelector("input[name=projectUrl]").value;
    
    const person = {
        id: editId,
        firstName,
        projectName,
        projectUrl
    };
    console.info('updating...', person, JSON.stringify(person));

    fetch(API.UPDATE.URL, {
        method: API.UPDATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.UPDATE.METHOD === "GET" ? null : JSON.stringify(person)
    })
        .then(res => res.json())
        .then(r => {
            if (r.success) {
                loadList();
            }
        });
}

function deleteTeamMember(id) {
    fetch(API.DELETE.URL, {
        method: API.DELETE.METHOD,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
        .then(r => r.json())
        .then(r => {
            if (r.success) {
                loadList();
            }
        });
}

function populateCurrentMember(id) {
    var person = allPersons.find(person => person.id === id);

    editId = id;
    
    const members = document.querySelector("#list input[name=members]");
    const projectName = document.querySelector("input[name=projectName]");
    const projectUrl = document.querySelector("input[name=projectUrl]");

    members.value = person.members;
    projectName.value = person.projectName;
    projectUrl.value = person.projectUrl;
}

function addEventListeners() {
    const search = document.getElementById('search');
    search.addEventListener("input", e => {
        const text = e.target.value;
        const filtrate = searchPersons(text);
        insertPersons(filtrate);
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
