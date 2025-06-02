// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDbvJsg1Z-oRDB6ZMrGvLev0qvOiuQynQA",
    authDomain: "isolv-1e081.firebaseapp.com",
    projectId: "isolv-1e081",
    storageBucket: "isolv-1e081.firebasestorage.app",
    messagingSenderId: "938429312462",
    appId: "1:938429312462:web:7df17d288affcb0f6fcf9f",
    measurementId: "G-3F8ZZ0B1K5"
  };

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Observador de estado de autenticação
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuário está logado
        console.log("Usuário logado:", user.email);
        
        // Verifica o tipo de usuário no Firestore
        db.collection("users").doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    UI.updateAuthUI(true);
                    UI.showUserArea(userData.type);
                } else {
                    console.log("Dados do usuário não encontrados!");
                    auth.signOut();
                }
            })
            .catch(error => {
                console.error("Erro ao buscar dados do usuário:", error);
            });
    } else {
        // Usuário não está logado
        console.log("Usuário não logado");
        UI.updateAuthUI(false);
        UI.showHomeScreen();
    }
});

// Funções de autenticação
const Auth = {
    login: (email, password) => {
        return auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.error("Erro no login:", error);
                throw error;
            });
    },

    register: (name, email, password, userType) => {
        return auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Adiciona informações adicionais do usuário no Firestore
                return db.collection("users").doc(userCredential.user.uid).set({
                    name: name,
                    email: email,
                    type: userType,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .catch(error => {
                console.error("Erro no registro:", error);
                throw error;
            });
    },

    logout: () => {
        return auth.signOut();
    }
};