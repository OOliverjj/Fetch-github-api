const screen = {
    userProfile: document.querySelector('.profile-data'),
    renderUser(user){
        this.userProfile.innerHTML = `<div class="info">
                            <img src="${user.avatarUrl}" alt="Foto de perfil do usuário"/>
                            <div class= "data">
                                <h1>${user.name ?? 'Não possui nome cadastrado 😢'}
                                <p>${user.bio ?? 'Não possui bio cadastrada 😢'}
                                <div class="followers">
                                    <p>Seguidores: ${user.followers}</p>
                                    <p>Seguindo: ${user.following}</p>
                                </div>
                            </div>
                            </div>`
        
        let repositoriesItens = ''
    user.repositories.forEach(repo => repositoriesItens += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <ul class="repo-info">
            <li>⭐ ${repo.stargazers_count}</li>
            <li>🍴 ${repo.forks_count}</li>
            <li>👀 ${repo.watchers_count}</li>
            <li>💻 ${repo.language ?? "Não possui linguaguem cadastrada"}</li>
        </ul>
        </li>`);

    
        if(user.repositories.length > 0){
            
            this.userProfile.innerHTML += `<div class=      "repositories">
                                            <h2>Repositórios</h2>
                                            <ul>${repositoriesItens}
                                            </ul>
                                            </div>`
        }
        
        
    },
    renderNotFound(){
        this.userProfile.innerHTML = "<h3>Usuário não encontrado</h3>"
    }
}

export { screen }