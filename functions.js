function insertPersons(persons) {
    const tbody = document.querySelector('#list tbody');
    tbody.innerHTML = getPersonsHtml(persons);
}

function getPersonsHtml (persons) {
    return persons.map(getPersonHtml).join("");
}

function getPersonHtml (person) {
    const gitHub = person.gitHub;
    return `<tr>
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td><a target="_blank" href="https://github.com/${gitHub}">Github</a></td>
    </tr>`;
}

let allPersons = [];

fetch('team.json')
    .then(res => res.json())
    .then(data => {
        allPersons = data;
        insertPersons(data);
    });

function searchPersons(text) {
    text = text.toLowerCase();
    console.warn("search", text);
    return allPersons.filter(person => {
        console.info(person.firstName);
        return person.firstName.toLowerCase().indexOf(text) > -1;
    });
}

const search = document.getElementById('search');
search.addEventListener("input", e => {
    const text = e.target.value;

    const filtrate = searchPersons(text);

    insertPersons(filtrate);
})