import "./style.css";
import { $, mask, sleep, unmask } from "./utilities";
import { loadTeamsRequest, updateTeamRequest, createTeamRequest, deleteTeamRequest } from "./middleware";

const form = "#teamsForm";

let allTeams = [];
let editId;

function getTeamAsHTML(team) {
  // const id = team.id;
  // const url = team.url;
  const { id, url } = team;
  const displayUrl = url.startsWith("https://github.com/") ? url.substring(19) : url;
  return `<tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>
      <a href="${url}" target="_blank">${displayUrl}</a>
    </td>
    <td>
      <button type="button" data-id="${id}" class="action-btn edit-btn">&#9998;</button>
      <button type="button" data-id="${id}" class="action-btn delete-btn">♻</button>
    </td>
  </tr>`;
}

function getTeamAsHTMLInputs({ promotion, members, name, url }) {
  return `<tr>
    <td>
      <input value="${promotion}" type="text" name="promotion" placeholder="Enter Promotion" required/>
    </td>
    <td>
      <input value="${members}" type="text" name="members" placeholder="Enter Members" required />
    </td>
    <td>
      <input value="${name}" type="text" name="name" placeholder="Enter Name" required />
    </td>
    <td>
      <input value="${url}" type="text" name="url" placeholder="Enter URL" required />
    </td>
    <td>
      <button type="submit" class="action-btn" title="Save">💾</button>
      <button type="reset" class="action-btn" title="Cancel">✖</button>
    </td>
  </tr>`;
}

let previewTeams = [];
function renderTeams(teams, editId) {
  if (!editId && teams === previewTeams) {
    console.warn("same teams aready rendered");
    return;
  }
  if (!editId && teams.length === previewTeams.length) {
    const sameContent = previewTeams.every((team, i) => team === teams[i]);
    if (sameContent) {
      console.info("sameContent");
      return;
    }
  }
  console.time("render");
  previewTeams = teams;
  const htmlTeams = teams.map(team => {
    return team.id === editId ? getTeamAsHTMLInputs(team) : getTeamAsHTML(team);
  });
  //console.warn(htmlTeams);
  $("#teamsTable tbody").innerHTML = htmlTeams.join("");
  addTitlesToOverflowCells();
  console.timeEnd("render");
}

function addTitlesToOverflowCells() {
  const cells = document.querySelectorAll("#teamsTable td");
  cells.forEach(cell => {
    cell.title = cell.offsetWidth < cell.scrollWidth ? cell.textContent : "";
  });
}

async function loadTeams() {
  mask(form);
  const teams = await loadTeamsRequest();
  console.warn("teams", teams);
  allTeams = teams;
  renderTeams(teams);
  unmask(form);
}

function getTeamValues(parent) {
  const promotion = $(`${parent} input[name=promotion]`).value;
  const members = $(`${parent} input[name=members]`).value;
  const name = $(`${parent} input[name=name]`).value;
  const url = $(`${parent} input[name=url]`).value;
  const team = {
    promotion,
    members,
    name,
    url
  };
  return team;
}

function onSubmit(e) {
  e.preventDefault();

  console.warn("update or create?", editId);

  const team = getTeamValues(editId ? "tbody" : "tfoot");

  mask(form);

  if (editId) {
    team.id = editId;
    console.warn("update...", team);
    updateTeamRequest(team).then(({ success }) => {
      if (success) {
        allTeams = allTeams.map(t => {
          if (t.id === team.id) {
            //var a = { x: 1, y: 2 }; var b = { y: 3, z: 4 }; var c = { ...a, ...c };
            return {
              ...t,
              ...team
            };
          }
          return t;
        });
        console.info(allTeams);
        renderTeams(allTeams);
        setInputsDisabled(false);
        editId = "";
      }
      unmask(form);
    });
  } else {
    createTeamRequest(team).then(({ success, id }) => {
      if (success) {
        team.id = id;
        allTeams = [...allTeams, team];
        renderTeams(allTeams);
        $(form).reset();
      }
      unmask(form);
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
  return teams.filter(({ promotion, members, name, url }) => {
    //console.info("search %o in %o", search, team.promotion);
    return (
      promotion.toLowerCase().includes(search) ||
      members.toLowerCase().includes(search) ||
      name.toLowerCase().includes(search) ||
      url.toLowerCase().includes(search)
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

  $(form).addEventListener("submit", onSubmit);
  $(form).addEventListener("reset", e => {
    console.info("reset", editId);
    if (editId) {
      // console.warn("cancel edit");
      allTeams = [...allTeams];
      renderTeams(allTeams);
      setInputsDisabled(false);
      editId = "";
    }
  });

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("button.delete-btn")) {
      const id = e.target.dataset.id;
      //console.warn("delete... %o", id);
      mask(form);
      deleteTeamRequest(id, status => {
        console.info("delete callback %o", status);
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

initEvents();
loadTeams();

// var p = sleep(5000);
// p.then(() => {
//   console.warn("ready");
// });
// console.info("after sleep", p);

// const p2 = await sleep(5000);
// console.info("after sleep2", p2);
