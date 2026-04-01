// Initial parameter URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const mailFromUrl = params.get('mail'); // get mail with lien

if (window.location.pathname.includes('resetPassword.html')) {
    const title = document.querySelector('h2');
    title.innerText = "Bienvenue ! Créez votre mot de passe";
}

const API_URL = 'http://localhost:5000';

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
            const response = await fetch(`${API_URL}/auth/forget-password`, {
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
            const reponse = await fetch(`${API_URL}/auth/resetPassword`, {
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
            const response = await fetch(`${API_URL}/auth/login`, {
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
            const response = await fetch(`${API_URL}/articles/${id}`, {
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
};

// get supplier into select
async function loadSuppliers() {
    try {
        const response = await fetch(`${API_URL}/suppliers`);
        if (!response.ok) throw new Error("Erreur réseau");

        const suppliers = await response.json();
        const select =document.getElementById("supplierSelect");

        // empty et fill selection
        if (select) {
            select.innerHTML = `<option value="">-- Selection --</option>`;
            suppliers.forEach((s) => {
                select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
            });

            console.log("Fournisseurs chargés avec succès");
        }
    } catch (error) {
        console.error("Erreur les chargements des fournisseurs:", error);
    }
}

async function loadAllArticles() {
    const response = await fetch(`${API_URL}/articles`);
    const articles = await response.json();

    // Help by Gemini : show different for sold out or few stock
    const tableBody = document.getElementById("getAllArticles");

    tableBody.innerHTML = articles.map(art => {
        // color logic
        let rowClass = "";

        if (art.actualStock === 0 ) {
            rowClass = 'table-danger';
        }
        else if (art.actualStock < art.minStock ) {
            rowClass = 'table-warning';
        }

        return `
            <tr class="${rowClass}">
                <td>${art.refArticle}</td>
                <td>${art.name}</td>
                <td style="text-align: center">${parseFloat(art.buyPrice).toFixed(2)}</td>
                <td style="text-align: center">${parseFloat(art.salePrice).toFixed(2)}</td>
                <td style="text-align: center;font-weight:bold">${art.actualStock}</td>
                <td style="text-align: center">${art.minStock}</td>
                <td>${art.supplierName}</td>
                <td>${art.description}</td>
                <td>
                    <button class="btn btn-sm btn-danger"
                        onclick="deleteArticle('${art.id}', '${art.refArticle}','${art.name}')">
                    </button>
                </td>
            </tr>
            `;
    }).join('');
}

// document.addEventListener("DOMContentLoaded", loadAllArticles);
document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadAllArticles === "function") loadAllArticles();
    if (typeof loadSuppliers === "function") loadSuppliers();
    if (typeof AddArticle === "function") AddArticle();
    const btnEdit = document.getElementById("btnOpenEditListEdit");
});

function AddArticle() {
    const addArticleForm = document.getElementById('addArticleForm');
    if (!addArticleForm) {
        console.error("Le formulaire est introuvable dans le HTML")
        return;
    }

    addArticleForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(addArticleForm);

        const buyPriceRaw = formData.get("buyPrice");
        const salePriceRaw = formData.get("salePrice");

        const articleData = {
            refArticle: formData.get("refArticle"),
            name: formData.get("name"),
            description: formData.get("description")?.trim() || "",
            buyPrice: parseFloat(buyPriceRaw).toFixed(2),
            salePrice: parseFloat(salePriceRaw).toFixed(2),
            actualStock: formData.get("actualStock") || 0,
            minStock: formData.get("minStock"),
            supplier_id: formData.get("supplier_id"),
            status: 1
        }

        if (!articleData.refArticle || !articleData.name) {
            alert("Référence et nom sont oubligatoire")
            return;
        }

        try {
            const response = await fetch(`${API_URL}/articles`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(articleData),
            });

            if (response.ok) {
                alert("Article ajouté avec succès");

            // close modal
            const modalElement = document.getElementById("modalAddArticle");
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.hide();
            }

            addArticleForm.reset();
            loadAllArticles();
        } else {
            const errorData = await response.json();
            alert("Erreur : " + errorData.message);
            console.error("Le formulaire addArticleForm n'a pas été trouvé");
        }
        } catch (error) {
            console.error("Erreur lors de l'envoie : ", error);
            alert("Impossible de connexion du serveur!")
        }
    });
}

// create list to click
async function prepareEditList() {
    try {
        const response = await fetch(`${API_URL}articles`);
        const articles = await response.json();
        const listContainer = document.getElementById("listEditArticles");

        listContainer.innerHTML = articles.map(art => `
            <button class="list-group-item list-group-item-action" onclick='selectArticleForEdit(${JSON.stringify(art)})'>
                <strong>${art.refArticle}</strong> - ${art.name}
            </button>
        `).join('');
    } catch (error) {
        console.error("Erreur liste modif:", error);
    }
}

function selectArticleForEdit(article) {
    isEditMode = true;
    currentArticleId = article.id;

    // 1. Fermer le modal de sélection
    const selectModal = bootstrap.Modal.getInstance(document.getElementById('modalSelectEdit'));
    selectModal.hide();

    // 2. Remplir ton formulaire habituel
    const form = document.getElementById('addArticleForm');
    form.querySelector('[name="refArticle"]').value = article.refArticle;
    form.querySelector('[name="name"]').value = article.name;
    form.querySelector('[name="buyPrice"]').value = article.buyPrice;
    form.querySelector('[name="salePrice"]').value = article.salePrice;
    form.querySelector('[name="actualStock"]').value = article.actualStock;
    form.querySelector('[name="minStock"]').value = article.minStock;
    form.querySelector('[name="supplier_id"]').value = article.supplier_id;
    form.querySelector('[name="description"]').value = article.description || "";

    // 3. Changer le titre et ouvrir le formulaire
    document.querySelector('#modalAddArticle .modal-title').innerText = "Modifier : " + article.name;
    const editModal = new bootstrap.Modal(document.getElementById('modalAddArticle'));
    editModal.show();
}

document.querySelector('[data-bs-target="#modalSelectEdit"]').addEventListener('click', prepareEditList);

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});