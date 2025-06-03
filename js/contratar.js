document.addEventListener('DOMContentLoaded', () => {
  const servicesGrid = document.getElementById('services-grid');
  const categoryFilter = document.getElementById('category-filter');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  const loadServices = async (category = 'all', searchTerm = '') => {
    servicesGrid.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner">⏳</div>
        <p>Carregando serviços...</p>
      </div>
    `;
    
    try {
      const snapshot = await db.collection('services')
        .where('status', '==', 'available')
        .get();
      
      if (snapshot.empty) {
        servicesGrid.innerHTML = '<p>Nenhum serviço disponível.</p>';
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
      
      // Exibir resultados
      servicesGrid.innerHTML = '';
      if (services.length === 0) {
        servicesGrid.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
      }
      
      services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
          <span class="service-category">${getCategoryName(service.category)}</span>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <p class="service-price">R$ ${service.price.toFixed(2).replace('.', ',')}</p>
          <p><strong>${service.providerName}</strong></p>
          <p class="service-contact">Contato: ${service.contactInfo}</p>
        `;
        servicesGrid.appendChild(card);
      });
      
    } catch (error) {
      console.error('Erro ao carregar:', error);
      servicesGrid.innerHTML = '<p>Erro ao carregar serviços.</p>';
    }
  };
  
  const getCategoryName = (category) => {
    const categories = {
      'tecnologia': 'Tecnologia',
      'design': 'Design',
      'reparos': 'Reparos',
      'consultoria': 'Consultoria',
      'outros': 'Outros'
    };
    return categories[category] || category;
  };
  
  // Event listeners
  categoryFilter.addEventListener('change', () => loadServices(categoryFilter.value, searchInput.value));
  searchBtn.addEventListener('click', () => loadServices(categoryFilter.value, searchInput.value));
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadServices(categoryFilter.value, searchInput.value);
  });
  
  // Carregar inicialmente
  loadServices();
});