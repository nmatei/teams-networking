import "./style.css";

function loadTeams() {
  fetch("teams.json")
    .then(r => r.json())
    .then(teams => {
      console.warn("teams", teams);
    });
}

loadTeams();
