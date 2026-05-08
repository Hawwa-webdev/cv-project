const state = {
  NomPrenom: "",
  titre: "",
  tel: "",
  email: "",
  address: "",
  presentation: "",
  formations: [],
  competences: [],
  experiences: [],
  langues: [],
};

function byId(id) {
  return document.getElementById(id);
}

function safeText(value) {
  return value ? value.trim() : "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTemplateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("template") || "template1";
}

function loadTemplateCss() {
  const link = byId("template-css") || (() => {
    const created = document.createElement("link");
    created.id = "template-css";
    created.rel = "stylesheet";
    document.head.appendChild(created);
    return created;
  })();

  link.href = `css/${getTemplateFromUrl()}.css`;
}

function formatFormation(item) {
  const endYear = item.endYear || "Aujourd'hui";
  return `${item.startYear} - ${endYear} : ${item.title}`;
}

function formatExperience(item) {
  const endYear = item.endYear || "Aujourd'hui";
  return `${item.startYear} - ${endYear} : ${item.title}`;
}

function formatLangue(item) {
  return `${item.name} - ${item.level}`;
}

function renderList(listElement, items, formatter, onDelete) {
  if (!listElement) {
    return;
  }

  listElement.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${escapeHtml(formatter(item))}</span><button type="button">Supprimer</button>`;
    li.querySelector("button").addEventListener("click", (event) => {
      event.preventDefault();
      onDelete(index);
    });
    listElement.appendChild(li);
  });
}

function setText(id, value) {
  const el = byId(id);
  if (el) {
    el.textContent = value;
  }
}

function setHtml(id, html) {
  const el = byId(id);
  if (el) {
    el.innerHTML = html;
  }
}

function updatePreview() {
  setText("prenomNom-cv", state.NomPrenom || "");
  setText("titre-cv", state.titre || "");
  setText("email-cv", state.email || "");
  setText("telephone-cv", state.tel || "");
  setText("address-cv", state.address || "");
  setText("description-cv", state.presentation || "");

  setHtml(
    "formation-cv",
    state.formations.map((item) => `<div>${escapeHtml(formatFormation(item))}</div>`).join("")
  );

  setHtml(
    "experience-cv",
    state.experiences.map((item) => `<div>${escapeHtml(formatExperience(item))}</div>`).join("")
  );

  setHtml(
    "competences--",
    state.competences.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
  );

  setHtml(
    "langues-cv",
    state.langues.map((item) => `<div>${escapeHtml(formatLangue(item))}</div>`).join("")
  );
}

function bindInput(id, stateKey) {
  const input = byId(id);
  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    state[stateKey] = safeText(input.value);
    console.log(`[FORM] ${id}:`, state[stateKey]);
    updatePreview();
  });
}

function setupStepNavigation(form) {
  const steps = Array.from(form.querySelectorAll(".form-step"));
  let currentStep = 0;

  function showStep(stepIndex) {
    currentStep = Math.max(0, Math.min(stepIndex, steps.length - 1));
    steps.forEach((step, index) => {
      step.hidden = index !== currentStep;
    });
    const currentStepIndicator = byId("current-step");
    if (currentStepIndicator) {
      currentStepIndicator.textContent = String(currentStep + 1);
    }
    document.querySelectorAll(".progress-step").forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });
  }

  steps.forEach((step) => {
    const next = step.querySelector(".step-next");
    const prev = step.querySelector(".step-prev");

    if (next) {
      next.addEventListener("click", (event) => {
        event.preventDefault();
        showStep(currentStep + 1);
      });
    }

    if (prev) {
      prev.addEventListener("click", (event) => {
        event.preventDefault();
        showStep(currentStep - 1);
      });
    }
  });

  showStep(0);
}

function setupLists() {
  const formationList = byId("formation-list");
  const competenceList = byId("competence-list");
  const experienceList = byId("experience-list");
  const langueList = byId("langue-list");

  function rerender() {
    renderList(formationList, state.formations, formatFormation, (index) => {
      state.formations.splice(index, 1);
      console.log("[FORM] formations:", state.formations);
      rerender();
      updatePreview();
    });

    renderList(competenceList, state.competences, (item) => item, (index) => {
      state.competences.splice(index, 1);
      console.log("[FORM] competences:", state.competences);
      rerender();
      updatePreview();
    });

    renderList(experienceList, state.experiences, formatExperience, (index) => {
      state.experiences.splice(index, 1);
      console.log("[FORM] experiences:", state.experiences);
      rerender();
      updatePreview();
    });

    renderList(langueList, state.langues, formatLangue, (index) => {
      state.langues.splice(index, 1);
      console.log("[FORM] langues:", state.langues);
      rerender();
      updatePreview();
    });
  }

  const addFormation = byId("add-formation");
  if (addFormation) {
    addFormation.addEventListener("click", (event) => {
      event.preventDefault();
      const startYear = safeText(byId("formation-debut")?.value || "");
      const endYear = byId("formation-en-cours")?.checked ? "" : safeText(byId("formation-fin")?.value || "");
      const title = safeText(byId("formation-intitule")?.value || "");
      if (!startYear || !title) {
        return;
      }

      state.formations.push({ startYear, endYear, title });
      byId("formation-debut").value = "";
      byId("formation-fin").value = "";
      byId("formation-intitule").value = "";
      byId("formation-en-cours").checked = false;
      console.log("[FORM] formations:", state.formations);
      rerender();
      updatePreview();
    });
  }

  const addCompetence = byId("add-competence");
  if (addCompetence) {
    addCompetence.addEventListener("click", (event) => {
      event.preventDefault();
      const title = safeText(byId("competence-intitule")?.value || "");
      if (!title) {
        return;
      }

      state.competences.push(title);
      byId("competence-intitule").value = "";
      console.log("[FORM] competences:", state.competences);
      rerender();
      updatePreview();
    });
  }

  const addExperience = byId("add-experience");
  if (addExperience) {
    addExperience.addEventListener("click", (event) => {
      event.preventDefault();
      const startYear = safeText(byId("experience-debut")?.value || "");
      const endYear = byId("experience-en-cours")?.checked ? "" : safeText(byId("experience-fin")?.value || "");
      const title = safeText(byId("experience-intitule")?.value || "");
      if (!startYear || !title) {
        return;
      }

      state.experiences.push({ startYear, endYear, title });
      byId("experience-debut").value = "";
      byId("experience-fin").value = "";
      byId("experience-intitule").value = "";
      byId("experience-en-cours").checked = false;
      console.log("[FORM] experiences:", state.experiences);
      rerender();
      updatePreview();
    });
  }

  const addLangue = byId("add-langue");
  if (addLangue) {
    addLangue.addEventListener("click", (event) => {
      event.preventDefault();
      const name = safeText(byId("langue-intitule")?.value || "");
      const level = safeText(byId("langue-niveau")?.value || "");
      if (!name || !level) {
        return;
      }

      state.langues.push({ name, level });
      byId("langue-intitule").value = "";
      byId("langue-niveau").value = "";
      console.log("[FORM] langues:", state.langues);
      rerender();
      updatePreview();
    });
  }

  rerender();
}

function buildPayload() {
  return {
    template: getTemplateFromUrl(),
    NomPrenom: state.NomPrenom,
    titre: state.titre,
    tel: state.tel,
    email: state.email,
    address: state.address,
    presentation: state.presentation,
    formations: state.formations,
    competences: state.competences,
    experiences: state.experiences,
    langues: state.langues,
  };
}

function savePayload(payload) {
  sessionStorage.setItem('cvPayload', JSON.stringify(payload));
  console.log('[FORM] payload stocké dans sessionStorage');
}

function initFormPage() {
  const form = byId("form-cv");
  if (!form) {
    return;
  }

  console.log("[FORM] page formulaire initialisée");

  bindInput("NomPrenom", "NomPrenom");
  bindInput("Titre", "titre");
  bindInput("Telephone", "tel");
  bindInput("Email", "email");
  bindInput("Addresse", "address");
  bindInput("Description", "presentation");

  setupLists();
  setupStepNavigation(form);
  updatePreview();

  const downloadButton = byId("download-btn");
  if (downloadButton) {
    downloadButton.addEventListener("click", (event) => {
      event.preventDefault();
      generatePDF();
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.NomPrenom = safeText(byId("NomPrenom")?.value || "");
    state.titre = safeText(byId("Titre")?.value || "");
    state.tel = safeText(byId("Telephone")?.value || "");
    state.email = safeText(byId("Email")?.value || "");
    state.address = safeText(byId("Addresse")?.value || "");
    state.presentation = safeText(byId("Description")?.value || "");

    const payload = buildPayload();
    console.log("[FORM] payload final envoyé au CV:", payload);
    savePayload(payload);
    window.location.href = `cv.html?template=${encodeURIComponent(payload.template)}`;
  });
}

function readPayloadFromSessionStorage() {
  const raw = sessionStorage.getItem('cvPayload');
  if (!raw) {
    console.warn("[CV] sessionStorage vide");
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    console.log("[CV] payload lu depuis sessionStorage:", parsed);
    return parsed;
  } catch (error) {
    console.error("[CV] erreur parse sessionStorage:", error);
    return null;
  }
}

function renderCvPage() {
  const cvContent = byId("cv-content");
  if (!cvContent) {
    return;
  }

  loadTemplateCss();

  const elements = {
    prenomNom: !!byId("prenomNom-cv"),
    titre: !!byId("titre-cv"),
    email: !!byId("email-cv"),
    telephone: !!byId("telephone-cv"),
    address: !!byId("address-cv"),
    description: !!byId("description-cv"),
    formations: !!byId("formation-cv"),
    experiences: !!byId("experience-cv"),
    competences: !!byId("competences--"),
    langues: !!byId("langues-cv"),
  };
  console.log("[CV] éléments DOM trouvés:", elements);

  const data = readPayloadFromSessionStorage();
  if (!data) {
    console.warn("[CV] aucune donnée transmise au CV");
    return;
  }

  console.log("[CV] données à injecter dans le CV:", data);
  renderCvData(data);

  console.log("[CV] rendu terminé");
}

function renderCvData(data) {
  setText("prenomNom-cv", data.NomPrenom || "");
  setText("titre-cv", data.titre || "");
  setText("email-cv", data.email || "");
  setText("telephone-cv", data.tel || "");
  setText("address-cv", data.address || "");
  setText("description-cv", data.presentation || "");

  setHtml(
    "formation-cv",
    (data.formations || []).map((item) => `<div>${escapeHtml(formatFormation(item))}</div>`).join("")
  );

  setHtml(
    "experience-cv",
    (data.experiences || []).map((item) => `<div>${escapeHtml(formatExperience(item))}</div>`).join("")
  );

  setHtml(
    "competences--",
    (data.competences || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")
  );

  setHtml(
    "langues-cv",
    (data.langues || []).map((item) => `<div>${escapeHtml(formatLangue(item))}</div>`).join("")
  );
}

function generatePDF() {
  const cvContent = byId("cv-content");
  if (!cvContent || typeof html2pdf === "undefined") {
    alert("Erreur : impossible de générer le PDF");
    return;
  }

  const data = readPayloadFromSessionStorage();
  const isFormPage = !!byId("form-cv");
  if (data && !isFormPage) {
    renderCvData(data);
  }

  const fileNameSource = isFormPage ? state.NomPrenom : data?.NomPrenom || state.NomPrenom;

  html2pdf()
    .from(cvContent)
    .set({
      margin: 0,
      filename: `CV_${fileNameSource || "CV"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    })
    .save();
}

function selectTemplate(template) {
  if (template !== "template1") {
    return;
  }
  window.location.href = `form.html?template=${encodeURIComponent(template)}`;
}

window.generatePDF = generatePDF;
window.selectTemplate = selectTemplate;
window.choixTemplate = selectTemplate;

function init() {
  initFormPage();
  renderCvPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
