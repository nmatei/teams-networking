import "./style.css";

console.warn("app ready");

function loadTeams() {
  const promise = fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
      console.table(teams);
      return teams;
    });
  console.warn("loadTeams", promise);
}

loadTeams();
