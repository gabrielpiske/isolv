document.addEventListener('DOMContentLoaded', () => {
  const servicesContainer = document.getElementById('services-container');
  const categoryFilter = document.getElementById('category-filter');
  const searchBox = document.getElementById('search-box');
  
  // Função para carregar serviços
  const loadServices = async (category = 'all', searchTerm = '') => {
    try {
      let query = db.collection('services').where('status', '==', 'available');
      
      const snapshot = await query.get();
      servicesContainer.innerHTML = '';
      
      if (snapshot.empty) {
        servicesContainer.innerHTML = '<p>Nenhum serviço disponível no momento.</p>';
        return;
      }
      
      let services = [];
      snapshot.forEach(doc => {
        const service = doc.data();
        service.id = doc.id;
        services.push(service);
      });
      
      // Aplicar filtros
      services = services.filter(service => {
        const matchesCategory = category === 'all' || service.category === category;
        const matchesSearch = searchTerm === '' || 
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          service.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      
      if (services.length === 0) {
        servicesContainer.innerHTML = '<p>Nenhum serviço encontrado com os filtros selecionados.</p>';
        return;
      }
      
      // Ordenar por data mais recente
      services.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      
      // Exibir serviços
      services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
          <span class="category">${getCategoryName(service.category)}</span>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <p class="price">R$ ${service.price.toFixed(2).replace('.', ',')}</p>
          <p class="provider">${service.providerName}</p>
          <p class="contact">Contato: ${service.contactInfo}</p>
        `;
        servicesContainer.appendChild(serviceCard);
      });
      
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      servicesContainer.innerHTML = '<p>Ocorreu um erro ao carregar os serviços.</p>';
    }
  };
  
  // Função auxiliar para nome de categoria
  const getCategoryName = (category) => {
    const categories = {
      'tecnologia': 'Tecnologia',
      'reparos': 'Reparos',
      'design': 'Design',
      'educacao': 'Educação',
      'outros': 'Outros'
    };
    return categories[category] || category;
  };
  
  // Event listeners para filtros
  categoryFilter.addEventListener('change', () => {
    loadServices(categoryFilter.value, searchBox.value);
  });
  
  searchBox.addEventListener('input', () => {
    loadServices(categoryFilter.value, searchBox.value);
  });
  
  // Carregar serviços inicialmente
  loadServices();
});