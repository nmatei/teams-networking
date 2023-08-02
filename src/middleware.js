export function loadTeamsRequest() {
  let url = "http://localhost:3000/teams-json";
  if (window.location.host === "nmatei.github.io") {
    url = "data/teams.json";
  }
  return fetch(url).then(r => r.json());
}

export function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

export function deleteTeamRequest(id, callback) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  })
    .then(r => r.json())
    .then(status => {
      //console.info("delete status", status, typeof callback);
      if (typeof callback === "function") {
        callback(status);
      }
      return status;
    });
}

export function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}
