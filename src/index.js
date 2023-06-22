import "./style.css";

function loadTeams() {
  const request = fetch("teams.json");
  console.warn("request", request);
  const response = request.then(r => r.json());
  console.warn("response", response);
  const r2 = response.then(result => {
    console.warn("result", result);
  });
}

loadTeams();
