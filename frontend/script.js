
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (window.location.pathname.includes('resetPassword.html')) {
    const title = document.querySelector('h2');
    title.innerText = "Bienvenue ! Créez votre mot de passe";
}
const passwordForm = document.getElementById('formLogin');

passwordForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const mail = document.getElementById("mail").value;
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

    try {
        // send to backend with fetch
        const reponse = await fetch("http://localhost:5000/auth/resetPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mail: mail,
                token: token,
                password: newPassword,
            })
        });

        const data = await reponse.json();

        if (reponse.ok) {
            alert("Mot de passe créé avec succès ! Vous pouvez se connecter");
            window.location.href = "../login.html";
        } else {
            alert("Erreur venant du serveur !");
        }
    } catch (error) {
        console.error("Erreur technique : ", error);
        alert("Impossible de connexion du serveur !");
    }
});