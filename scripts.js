const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    // deactivate all tabs
    tabs.forEach(t => t.classList.remove("active"));

    // hide all panels
    panels.forEach(p => p.classList.remove("active"));

    // activate clicked tab
    tab.classList.add("active");

    // show matching panel
    document
      .querySelector(`.panel[data-panel="${target}"]`)
      .classList.add("active");
  });
});
