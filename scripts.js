const content = document.querySelector(".content");
const homeView = document.getElementById("home-view");
const entryView = document.getElementById("entry-view");
const entryText = document.getElementById("entry-text");
const entryList = document.getElementById("entry-list");

let homeScroll = 0;

/* ---------- Entries list ---------- */

// entries.txt holds one filename per line, e.g. 2026-10-27.txt
// The files themselves live in the entries/ folder.
fetch("entries.txt", { cache: "no-cache" })
  .then(res => {
    if (!res.ok) throw new Error(res.status);
    return res.text();
  })
  .then(text => {
    const names = text
      .split("\n")
      .map(n => n.trim())
      .filter(Boolean)
      .sort()
      .reverse(); // newest first (ISO dates sort alphabetically)

    if (names.length === 0) {
      entryList.innerHTML = "<li>No entries yet.</li>";
      return;
    }

    names.forEach(name => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${encodeURIComponent(name)}`;
      a.textContent = name;
      li.appendChild(a);
      entryList.appendChild(li);
    });
  })
  .catch(() => {
    entryList.innerHTML = "<li>No entries yet.</li>";
  });

/* ---------- Switching between the main page and an entry ---------- */

const showHome = () => {
  entryView.hidden = true;
  homeView.hidden = false;
  content.scrollTop = homeScroll;
  document.title = "John Halvorson ⋅ Home";
};

const showEntry = async name => {
  // Remember where we were on the main page so Back puts us there
  if (!homeView.hidden) homeScroll = content.scrollTop;

  homeView.hidden = true;
  entryView.hidden = false;
  content.scrollTop = 0;
  document.title = `John Halvorson ⋅ ${name}`;
  entryText.textContent = "";

  // Only plain filenames like 2026-10-27.txt
  if (!/^[\w-]+\.txt$/.test(name)) {
    entryText.textContent = "Entry not found.";
    return;
  }

  try {
    const res = await fetch(`entries/${name}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    const text = await res.text();
    if (decodeURIComponent(location.hash.slice(1)) !== name) return; // navigated away
    entryText.textContent = text;
  } catch {
    entryText.textContent = "Entry not found.";
  }
};

const route = () => {
  const name = decodeURIComponent(location.hash.slice(1));
  if (name) {
    showEntry(name);
  } else {
    showHome();
  }
};

window.addEventListener("hashchange", route);
route();

/* ---------- Header quote ---------- */

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
    .then(res => {
      if (!res.ok) throw new Error(res.status);
      return res.text();
    })
    .then(text => {
      quotes = text.split("\n").map(q => q.trim()).filter(Boolean);
      showRandomQuote();
    })
    .catch(() => {});

  quoteEl.addEventListener("click", showRandomQuote);
}
