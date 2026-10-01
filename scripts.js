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

const quoteEl = document.getElementById("quote");

if (quoteEl) {
  let quotes = [];
  let current = -1;

  const showRandomQuote = () => {
    if (quotes.length === 0) return;

    let i;
    do {
      i = Math.floor(Math.random() * quotes.length);
    } while (i === current && quotes.length > 1);

    current = i;
    quoteEl.textContent = `\u201C${quotes[i]}\u201D`;
  };

  fetch("quotes.txt", { cache: "no-cache" })
    .then(res => res.text())
    .then(text => {
      quotes = text.split("\n").map(q => q.trim()).filter(Boolean);
      showRandomQuote();
    })
    .catch(() => {});

  quoteEl.addEventListener("click", showRandomQuote);
}
