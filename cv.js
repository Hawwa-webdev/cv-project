//empecher le rechargement de la page
const form = document.getElementById("form-cv");
form.addEventListener("submit",function(e) {
 e.preventDefault();

// recuperation des données du formulaire
const presentation = document.getElementById("Description").value;
const parcours = document.getElementById("Formation").value;
const expPro = document.getElementById("Experiences").value;
const id = document.getElementById("Nom, Prenom").value;
const titre = document.getElementById("Titre").value;
const email = document.getElementById("Email").value;
const tel = document.getElementById("Telephone").value;
const address = document.getElementById("Addresse").value;
const skills = document.getElementById("Competences").value;
const langue = document.getElementById("langues").value;

// affectation des données du formulaire dans le cv
document.getElementById("description-cv").textContent= presentation;
document.getElementById("formation-cv").textContent= parcours;
document.getElementById("experience-cv").textContent= expPro;
document.getElementById("prenomNom").textContent= id;
document.getElementById("titre-cv").textContent=titre;
document.getElementById("email-cv").textContent= email;
document.getElementById("telephone-cv").textContent=tel;
document.getElementById("address-cv").textContent=address;
document.getElementById("competences").textContent=skills;
document.getElementById("langues").textContent = langue;
});

//Téléchargement
const dl = getElementById("download");
dl.addEventListener("click", ())