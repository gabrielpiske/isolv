document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('service-form');
  const successMessage = document.getElementById('success-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const serviceData = {
      title: document.getElementById('service-title').value,
      description: document.getElementById('service-description').value,
      price: parseFloat(document.getElementById('service-price').value),
      providerName: document.getElementById('provider-name').value,
      contactInfo: document.getElementById('contact-info').value,
      category: document.getElementById('service-category').value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'available'
    };
    
    try {
      await db.collection('services').add(serviceData);
      form.reset();
      form.classList.add('hidden');
      successMessage.classList.remove('hidden');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar. Tente novamente.');
    }
  });
});