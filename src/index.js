//import debounce from "lodash/debounce";
import { getTeamsRequest, updateTeamRequest, createTeamRequest, deleteTeamRequest } from "./requests";
import { $, debounce, sleep } from "./utils";

let allTeams = [];
var editId;

function getTeamAsHTML({ id, url, promotion, members, name }) {
  let displayURL = url;
  if (url.startsWith("https://")) {
    displayURL = url.substring(8);
  }
  return `
  <tr>
    <td>
      <input type="checkbox" name="selected" />
    </td>
    <td>${promotion}</td>
    <td>${members}</td>
    <td>${name}</td>
    <td><a href="${url}" target="_blank">${displayURL}</a></td>
    <td>
      <a data-id="${id}" class="link-btn remove-btn">✖</a>
      <a data-id="${id}" class="link-btn edit-btn">&#9998;</a>
    </td>
  </tr>`;
}

// TODO any chance to have this private?
let previewDisplayedTeams = [];
function showTeams(teams) {
  if (teams === previewDisplayedTeams) {
    console.info("same teams");
    return false;
  }
  if (teams.length === previewDisplayedTeams.length) {
    var eqContent = teams.every((t, i) => t === previewDisplayedTeams[i]);
    if (eqContent) {
      console.info("same content");
      return false;
    }
  }

  previewDisplayedTeams = teams;
  const html = teams.map(getTeamAsHTML);
  $("table tbody").innerHTML = html.join("");
  return true;
}

// TODO remove
window.showTeams = showTeams;

async function formSubmit(e) {
  e.preventDefault();
  //console.warn("submit", e);

  const team = getFormValues();

  if (editId) {
    team.id = editId;
    console.warn("update...?", editId, team);
    const { success } = await updateTeamRequest(team);
    if (success) {
      allTeams = allTeams.map(t => {
        if (t.id === team.id) {
          return {
            ...t, // old props (eg. createdBy, createdAt)
            ...team
          };
        }
        return t;
      });
    }
  } else {
    const { success, id } = await createTeamRequest(team);
    if (success) {
      team.id = id;
      allTeams = [...allTeams, team];
    }
  }

  showTeams(allTeams) && $("#editForm").reset();
}

function getFormValues() {
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
  return team;
}

function setFormValues({ promotion, members, name, url }) {
  $("#promotion").value = promotion;
  $("#members").value = members;
  $("#name").value = name;
  $("#url").value = url;
}

async function deleteTeam(id) {
  console.warn("delete", id);
  const { success } = await deleteTeamRequest(id);
  if (success) {
    allTeams = allTeams.filter(t => t.id !== id);
    showTeams(allTeams);
  }
}

function startEditTeam(edit) {
  editId = edit;
  const team = allTeams.find(({ id }) => id === edit);
  setFormValues(team);
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

function removeSelected() {
  console.warn("removeSelected");
  // find ids...
  // add mask...
  // call remove deleteTeamRequest
  // remove mask
}

function initEvents() {
  const form = $("#editForm");
  form.addEventListener("submit", formSubmit);
  form.addEventListener("reset", () => {
    editId = undefined;
  });

  $("#removeSelected").addEventListener("click", removeSelected);

  $("#search").addEventListener(
    "input",
    debounce(function (e) {
      //const search = $("#search").value;
      const search = e.target.value;
      console.info("search", search);
      const teams = searchTeams(allTeams, search);
      showTeams(teams);
    }, 300)
  );

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

async function loadTeams(cb) {
  const teams = await getTeamsRequest();
  //console.warn(this, window);
  allTeams = teams;
  showTeams(teams);
  if (typeof cb === "function") {
    cb(teams);
  }
  return teams;
}

(async () => {
  $("#editForm").classList.add("loading-mask");
  await loadTeams();
  await sleep(100);
  $("#editForm").classList.remove("loading-mask");

  // console.info("1.start");

  // // sleep(4000).then(() => {
  // //   console.info("4.ready to do %o!", "training");
  // // });
  // await sleep(4000);
  // console.info("4.ready to do %o!", "training");

  // console.warn("2.after sleep");

  // sleep(5000);
  // console.info("3.await sleep");
})();

initEvents();
