const UI = {
    // Atualiza a UI com base no estado de autenticação
    updateAuthUI: (isLoggedIn) => {
        document.getElementById('login-btn').style.display = isLoggedIn ? 'none' : 'inline-block';
        document.getElementById('register-btn').style.display = isLoggedIn ? 'none' : 'inline-block';
        document.getElementById('logout-btn').style.display = isLoggedIn ? 'inline-block' : 'none';
        document.getElementById('auth-forms').style.display = 'none';
    },

    // Mostra a tela inicial
    showHomeScreen: () => {
        document.getElementById('home-screen').style.display = 'block';
        document.getElementById('provider-area').style.display = 'none';
        document.getElementById('client-area').style.display = 'none';
    },

    // Mostra a área do usuário com base no tipo (client/provider)
    showUserArea: (userType) => {
        document.getElementById('home-screen').style.display = 'none';

        if (userType === 'provider') {
            document.getElementById('provider-area').style.display = 'block';
            document.getElementById('client-area').style.display = 'none';
            Main.loadProviderServices();
        } else {
            document.getElementById('provider-area').style.display = 'none';
            document.getElementById('client-area').style.display = 'block';
            Main.loadAvailableServices();
        }
    },

    // Mostra o formulário de login
    showLoginForm: () => {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('auth-forms').style.display = 'block';
        document.getElementById('home-screen').style.display = 'none';
    },

    // Mostra o formulário de registro
    showRegisterForm: () => {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        document.getElementById('auth-forms').style.display = 'block';
        document.getElementById('home-screen').style.display = 'none';
    },

    // Mostra o formulário de serviço
    showServiceForm: (service = null) => {
        const form = document.getElementById('service-form');
        if (service) {
            // Edição de serviço existente
            document.getElementById('service-title').value = service.title;
            document.getElementById('service-description').value = service.description;
            document.getElementById('service-price').value = service.price;
            document.getElementById('service-category').value = service.category;
            form.dataset.serviceId = service.id;
        } else {
            // Novo serviço - garantir que os campos estão vazios
            document.getElementById('service-title').value = '';
            document.getElementById('service-description').value = '';
            document.getElementById('service-price').value = '';
            document.getElementById('service-category').value = 'tecnologia';
            if (form.dataset.serviceId) {
                delete form.dataset.serviceId;
            }
        }
        form.style.display = 'block';
    },

    // Renderiza a lista de serviços para clientes
    renderServicesList: (services) => {
        const container = document.getElementById('services-list');
        container.innerHTML = '';

        if (services.length === 0) {
            container.innerHTML = '<p>Nenhum serviço encontrado.</p>';
            return;
        }

        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <span class="category">${this.getCategoryName(service.category)}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <p class="price">R$ ${service.price.toFixed(2)}</p>
                <p><small>Oferecido por: ${service.providerName}</small></p>
                <button class="contact-btn" data-id="${service.id}">Entrar em Contato</button>
            `;
            container.appendChild(card);
        });
    },

    // Renderiza a lista de serviços para prestadores
    renderProviderServicesList: (services) => {
        const container = document.getElementById('provider-services-list');
        container.innerHTML = '';

        if (services.length === 0) {
            container.innerHTML = '<p>Você ainda não cadastrou nenhum serviço.</p>';
            return;
        }

        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <span class="category">${this.getCategoryName(service.category)}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <p class="price">R$ ${service.price.toFixed(2)}</p>
                <p><small>Status: ${service.status === 'available' ? 'Disponível' : 'Indisponível'}</small></p>
                <div class="service-actions">
                    <button class="edit-service" data-id="${service.id}">Editar</button>
                    <button class="delete-service" data-id="${service.id}">Excluir</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // Obtém o nome amigável da categoria
    getCategoryName: (category) => {
        const categories = {
            'tecnologia': 'Tecnologia',
            'reparos': 'Reparos',
            'design': 'Design',
            'educacao': 'Educação',
            'outros': 'Outros'
        };
        return categories[category] || category;
    },

    // Mostra mensagem de erro
    showError: (message) => {
        alert(message); // Em uma aplicação real, use um modal ou toast mais elegante
    }
};