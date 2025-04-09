import { getUser } from "./services/user.js"
import { getRepositories } from "./services/repositories.js"
import { user } from "./objects/user.js"
import { screen } from "./objects/screen.js"

document.getElementById('btn-search').addEventListener('click', () => {
    const userName = document.getElementById('input-search').value
    if(validateEnptyInput(userName)) return
    getUserData(userName)
    
})

document.getElementById('input-search').addEventListener('keyup', (e) => {
    const userName = e.target.value
    const key = e.which || e.keyCode
    const  isEnterKeyPressed = key === 13

    if(isEnterKeyPressed){
        if(validateEnptyInput(userName)) return
        getUserData(userName)
    }
})

function validateEnptyInput(userName){
    if(userName.length === 0){
        alert('Preencha o campo com o nome do usuário do GitHub')
        return true
    }
}

async function getGitHubEvents() {
    const userName = document.getElementById("userName").value;
    const url = `https://api.github.com/users/${userName}/events`;
    const list = document.getElementById("eventsList");
    list.innerHTML = ""; // Clear previous results

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("GitHub user not found or request failed.");
      }

      const events = await response.json();
      const filteredEvents = events.filter(event =>
        event.type === "PushEvent" || event.type === "CreateEvent"
      ).slice(0, 10); // Only take up to 10 relevant events

      filteredEvents.forEach(event => {
        const li = document.createElement("li");
        if (event.type === "PushEvent") {
          const repoName = event.repo.name;
          const commitMessages = event.payload.commits.map(commit => commit.message).join(" | ");
          li.textContent = `Push to ${repoName}: ${commitMessages}`;
        } else if (event.type === "CreateEvent") {
          li.textContent = `CreateEvent in ${event.repo.name}: Sem mensagem de commit`;
        }
        list.appendChild(li);
      });

      if (filteredEvents.length === 0) {
        list.innerHTML = "<li>No recent CreateEvent or PushEvent found.</li>";
      }
    } catch (error) {
      list.innerHTML = `<li>Error: ${error.message}</li>`;
    }
  }

async function getUserData(userName) {
   const userResponse = await getUser(userName)
   const repositoriesResponse = await getRepositories(userName)
    if(userResponse.message === "Not Found"){ 
        screen.renderNotFound()
        return
    }
    console.log(userResponse);
    
   user.setInfo(userResponse)
   user.setRepositories(repositoriesResponse)
   screen.renderUser(user)
    getGitHubEvents()
   
   
    };


    

