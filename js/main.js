const Main = {
    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        // Navegação
        document.getElementById('login-btn').addEventListener('click', () => UI.showLoginForm());
        document.getElementById('register-btn').addEventListener('click', () => UI.showRegisterForm());
        document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());
        document.getElementById('offer-service-btn').addEventListener('click', () => this.showProviderArea());
        document.getElementById('hire-service-btn').addEventListener('click', () => this.showClientArea());
        
        // Formulários de autenticação
        document.getElementById('submit-login').addEventListener('click', this.handleLogin);
        document.getElementById('cancel-login').addEventListener('click', () => UI.showHomeScreen());
        document.getElementById('submit-register').addEventListener('click', this.handleRegister);
        document.getElementById('cancel-register').addEventListener('click', () => UI.showHomeScreen());
        
        // Serviços
        document.getElementById('add-service-btn').addEventListener('click', () => UI.showServiceForm());
        document.getElementById('save-service').addEventListener('click', this.saveService);
        document.getElementById('cancel-service').addEventListener('click', () => {
            document.getElementById('service-form').style.display = 'none';
        });
        
        // Filtros
        document.getElementById('category-filter').addEventListener('change', () => this.loadAvailableServices());
        document.getElementById('search-box').addEventListener('input', () => this.loadAvailableServices());
        
        // Delegação de eventos para elementos dinâmicos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-service')) {
                this.editService(e.target.dataset.id);
            }
            if (e.target.classList.contains('delete-service')) {
                this.deleteService(e.target.dataset.id);
            }
            if (e.target.classList.contains('contact-btn')) {
                this.contactService(e.target.dataset.id);
            }
        });
    },

    handleLogin: function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        Auth.login(email, password)
            .then(() => {
                UI.showHomeScreen();
            })
            .catch(error => {
                UI.showError("Erro no login: " + error.message);
            });
    },

    handleRegister: function() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const userType = document.getElementById('user-type').value;
        
        Auth.register(name, email, password, userType)
            .then(() => {
                UI.showHomeScreen();
            })
            .catch(error => {
                UI.showError("Erro no registro: " + error.message);
            });
    },

    showProviderArea: function() {
        const user = firebase.auth().currentUser;
        if (user) {
            UI.showUserArea('provider');
        } else {
            UI.showLoginForm();
        }
    },

    showClientArea: function() {
        const user = firebase.auth().currentUser;
        if (user) {
            UI.showUserArea('client');
        } else {
            UI.showLoginForm();
        }
    },

    loadAvailableServices: function() {
        const category = document.getElementById('category-filter').value;
        const searchTerm = document.getElementById('search-box').value;
        
        Database.getAvailableServices(category, searchTerm)
            .then(services => {
                UI.renderServicesList(services);
            })
            .catch(error => {
                console.error("Erro ao carregar serviços:", error);
                UI.showError("Erro ao carregar serviços disponíveis");
            });
    },

    loadProviderServices: function() {
        const user = firebase.auth().currentUser;
        if (!user) return;
        
        Database.getProviderServices(user.uid)
            .then(services => {
                UI.renderProviderServicesList(services);
            })
            .catch(error => {
                console.error("Erro ao carregar serviços do prestador:", error);
                UI.showError("Erro ao carregar seus serviços");
            });
    },

    saveService: function() {
        const form = document.getElementById('service-form');
        const serviceData = {
            title: document.getElementById('service-title').value,
            description: document.getElementById('service-description').value,
            price: parseFloat(document.getElementById('service-price').value),
            category: document.getElementById('service-category').value
        };
        
        if (!serviceData.title || !serviceData.description || isNaN(serviceData.price)) {
            UI.showError("Preencha todos os campos corretamente");
            return;
        }
        
        const serviceId = form.dataset.serviceId;
        let promise;
        
        if (serviceId) {
            promise = Database.updateService(serviceId, serviceData);
        } else {
            promise = Database.addService(serviceData);
        }
        
        promise.then(() => {
            form.style.display = 'none';
            Main.loadProviderServices();
        })
        .catch(error => {
            console.error("Erro ao salvar serviço:", error);
            UI.showError("Erro ao salvar serviço");
        });
    },

    editService: function(serviceId) {
        const user = firebase.auth().currentUser;
        if (!user) return;
        
        Database.getProviderServices(user.uid)
            .then(services => {
                const service = services.find(s => s.id === serviceId);
                if (service) {
                    UI.showServiceForm(service);
                }
            })
            .catch(error => {
                console.error("Erro ao buscar serviço para edição:", error);
                UI.showError("Erro ao carregar serviço para edição");
            });
    },

    deleteService: function(serviceId) {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
        
        Database.deleteService(serviceId)
            .then(() => {
                Main.loadProviderServices();
            })
            .catch(error => {
                console.error("Erro ao excluir serviço:", error);
                UI.showError("Erro ao excluir serviço");
            });
    },

    contactService: function(serviceId) {
        alert("Funcionalidade de contato será implementada aqui!\nID do serviço: " + serviceId);
        // Em uma aplicação real, você poderia:
        // 1. Abrir um chat com o prestador
        // 2. Mostrar informações de contato
        // 3. Enviar um email
    }
};

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    Main.init();
});