//empecher le rechargement de la page
const form = document.getElementById("form-cv");
form.addEventListener("submit",function(e) {
 e.preventDefault();

// recuperation des données du formulaire
cvData ={
   presentation: document.getElementById("Description").value,
   parcours:document.getElementById("Formation").value,
   expPro : document.getElementById("Experiences").value,
   NomPrenom : document.getElementById("Nomprenom").value,
   titre : document.getElementById("Titre").value,
   email : document.getElementById("Email").value,
   tel : document.getElementById("Telephone").value,
   address : document.getElementById("Addresse").value,
   skills : document.getElementById("Competences").value,
   langue : document.getElementById("langues").value
};
  localStorage.setItem("cvData", JSON.srtringfy(cvData));
  window.location.href = "cv.html";
});

// affectation des données du formulaire dans le cv
window.addEventListener("DOMContentLoaded",()=> {
  const data = JSON.parse(localStorage.getItem("cvData"));
  if (!data) return;

document.getElementById("description-cv").textContent= data.presentation;
document.getElementById("formation-cv").textContent= data.parcours;
document.getElementById("experience-cv").textContent= data.expPro;
document.getElementById("prenomNom").textContent= data.NomPrenom;
document.getElementById("titre-cv").textContent= data.titre;
document.getElementById("email-cv").textContent= data.email;
document.getElementById("telephone-cv").textContent= data.tel;
document.getElementById("address-cv").textContent= data.address;
document.getElementById("competences").textContent= data.skills;
document.getElementById("langues").textContent = data.langue;
});

//Téléchargement
function generatePDF() {
  const element = document.getElementById("cv-content");

  html2pdf().from(element).save();
}


// Choix des templates
function choixTemplate(template){
  localStorage.setItem("template", template);
  window.location.href = "form.html";
}
window.choixTemplate = choixTemplate;

const t= localStorage.getElementById("modele") || "template1";
document.getElementById("modele").href = `css/${t}.css`

//chargement de la photo
