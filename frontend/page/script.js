// Initial parameter URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const mailFromUrl = params.get('mail'); // get mail with lien

if (window.location.pathname.includes('resetPassword.html')) {
    const title = document.querySelector('h2');
    title.innerText = "Bienvenue ! Créez votre mot de passe";
}

const API_URL = 'http://localhost:5000/auth';

// Reinitial password on login.html
const forgotBtn = document.getElementById('forgotPassword');

if (forgotBtn) {
    forgotBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const mail = document.getElementById("exampleInputEmail").value;

        if (!mail) {
            alert("Veuiller saisir votre mail.")
            return
        }

        try {
            const response = await fetch(`${API_URL}/forget-password`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({mail: mail})
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert("Erreur de connexion au serveur");
        }
    });
}

// create password and check id HTML page
const passwordForm = document.getElementById('formLogin');

// hostname != pathname
if (passwordForm && window.location.pathname.includes('resetPassword.html')) {
    passwordForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!token) {
            alert("Erreur : aucun jeton de sécurité trouvé. Veuillez utiliser le lien reçu")
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Les mot de passe ne correspond pas !");
            return;
        }

        if (newPassword.length < 6){
            alert("Le mot de passe doit faire au moins 6 caractères");
            return;
        }

        try {
            // send to backend with fetch
            const reponse = await fetch(`${API_URL}/resetPassword`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    mail: mailFromUrl,
                    token: token,
                    password: newPassword,
                })
            });

            const data = await reponse.json();

            if (reponse.ok) {
                alert("Mot de passe créé avec succès ! Vous pouvez se connecter");
                window.location.href = "login.html";
            } else {
                alert("Erreur venant du serveur !");
            }
        } catch (error) {
            console.error("Erreur technique : ", error);
            alert("Impossible de connexion du serveur !");
        }
    });
}

// Connexion to login
const loginForm = document.getElementById('formLogin');

if (loginForm) {
    console.log("Formulaire de login détecté !");

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log("le bouton login a été cliqué !")

        const mail = document.getElementById("exampleInputEmail").value;
        const password = document.getElementById("newPassword").value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    mail: mail,
                    password: password,
                })
            });
            const data = await response.json();

            if (response.ok){
                alert("Connexion réussie !");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Identifiants incorrects");
            }
        } catch (error) {
            console.error("Erreur login : ", error);
            alert("Impossible de connexion du serveur !");
        }
    });
}

async function deleteArticle(id, ref, name) {
    if (confirm(`Voulez-vous vraiment supprimer l'article : \n[${ref}] ${name} ?`)) {
        try {
            const response = await fetch(`http://localhost:5000/articles/${id}`, {
                method: 'DELETE',

            });
            if (response.ok) {
                alert(`L'article ${name} supprimé avec succès !`);
                loadAllArticles();
            } else {
                alert("Erreur lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    }
}