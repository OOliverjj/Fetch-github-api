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
    const isEnterKeyPressed = key === 13

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

async function getGitHubEvents(userName) {
    const url = `https://api.github.com/users/${userName}/events`;
    const list = document.getElementById("eventsList");
    list.innerHTML = ""; // Limpa resultados anteriores

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("GitHub user not found or request failed.");
        }

        const events = await response.json();
        // MUDANÇA 1: Filtra apenas PushEvent e CreateEvent, limitando a 10 eventos
        const filteredEvents = events.filter(event =>
            event.type === "PushEvent" || event.type === "CreateEvent"
        ).slice(0, 10);

        if (filteredEvents.length === 0) {
            list.innerHTML = "<li>Nenhum createEvent recente ou pushEvent encontrado.</li>";
            return;
        }

        // MUDANÇA 2: Nova lógica para processar e exibir eventos
        let eventsItems = '';
        filteredEvents.forEach(event => {
            // MUDANÇA 3: Tratamento específico para PushEvent
            if (event.type === 'PushEvent') {
                const commits = event.payload.commits;
                commits.forEach(commit => {
                    eventsItems += `<li>${commit.message}</li>`;
                });
            } 
            // MUDANÇA 4: Tratamento específico para CreateEvent
            else if (event.type === 'CreateEvent') {
                eventsItems += `<li>Created ${event.payload.ref_type}: ${event.payload.ref}</li>`;
            }
        });

        // MUDANÇA 5: Nova estrutura HTML para exibir os eventos
        list.innerHTML = `
            <div class="events">
                <h2>Eventos Recentes</h2>
                <ul>${eventsItems}</ul>
            </div>`;

    } catch (error) {
        list.innerHTML = `<li>Error: ${error.message}</li>`;
    }
}

async function getUserData(userName) {
    const userResponse = await getUser(userName)
    const repositoriesResponse = await getRepositories(userName)
    console.log(repositoriesResponse);
    
    if(userResponse.message === "Not Found"){ 
        screen.renderNotFound()
        return
    }
    user.setInfo(userResponse)
    user.setRepositories(repositoriesResponse)
    screen.renderUser(user)
    getGitHubEvents(userName)
}