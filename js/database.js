const Database = {
    // Adiciona um novo serviço
    addService: (serviceData) => {
        const user = firebase.auth().currentUser;
        if (!user) return Promise.reject("Usuário não autenticado");
        
        return db.collection("services").add({
            ...serviceData,
            providerId: user.uid,
            providerName: user.displayName || "Anônimo",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: "available"
        });
    },

    // Atualiza um serviço existente
    updateService: (serviceId, serviceData) => {
        return db.collection("services").doc(serviceId).update(serviceData);
    },

    // Remove um serviço
    deleteService: (serviceId) => {
        return db.collection("services").doc(serviceId).delete();
    },

    // Obtém todos os serviços disponíveis
    getAvailableServices: (category = "all", searchTerm = "") => {
        let query = db.collection("services").where("status", "==", "available");
        
        if (category !== "all") {
            query = query.where("category", "==", category);
        }
        
        return query.get().then(snapshot => {
            const services = [];
            snapshot.forEach(doc => {
                const service = doc.data();
                // Filtro de pesquisa no lado do cliente para simplificar
                if (searchTerm === "" || 
                    service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    service.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                    services.push({
                        id: doc.id,
                        ...service
                    });
                }
            });
            return services;
        });
    },

    // Obtém os serviços de um prestador específico
    getProviderServices: (providerId) => {
        return db.collection("services")
            .where("providerId", "==", providerId)
            .get()
            .then(snapshot => {
                const services = [];
                snapshot.forEach(doc => {
                    services.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                return services;
            });
    }
};