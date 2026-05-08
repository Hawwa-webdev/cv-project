function selectTemplate(template) {
  if (template !== "template1") {
    return;
  }
  window.location.href = `form.html?template=${encodeURIComponent(template)}`;
}

window.selectTemplate = selectTemplate;
