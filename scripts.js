const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const tabTitles = {
  about: "About",
  writing: "Writing",
  resources: "Resources"
};

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    document.querySelector(`.panel[data-panel="${target}"]`).classList.add("active");

    document.title = `John Halvorson ⋅ ${tabTitles[target]}`;
  });
});
