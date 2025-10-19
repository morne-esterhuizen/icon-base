/* js/main.js
   Loads icons from icons/icons.json (preferred), or falls back to an embedded list.
   Clicking an icon copies a jsDelivr CDN link that points to the dev branch.
*/

document.addEventListener("DOMContentLoaded", () => {
  const iconGrid = document.getElementById("iconGrid") || document.getElementById("icon-grid");
  const searchInput = document.getElementById("searchInput") || document.getElementById("search");
  const categoryFilter = document.getElementById("categoryFilter");
  const countsEl = document.getElementById("counts");
  const toast = document.getElementById("toast");

  if (!iconGrid || !searchInput || !categoryFilter) {
    console.error("Required DOM elements missing (#iconGrid, #searchInput, #categoryFilter).");
    return;
  }

  // Default fallback icons (only used if icons/icons.json can't be fetched).
  const FALLBACK_ICONS = [
    { name: "checkmark", category: "system" },
    { name: "close", category: "system" },
    { name: "facebook", category: "brand" },
    { name: "twitter", category: "brand" }
  ];

  // Where to copy CDN links from — uses dev branch for demo.
  const CDN_BASE = "https://cdn.jsdelivr.net/gh/morne-esterhuizen/icon-base@dev";

  let icons = []; // { name, category, path }

  // Load icons manifest (icons/icons.json expected to be an array of objects {name, category})
  async function loadManifest() {
    try {
      const res = await fetch("icons/icons.json", { cache: "no-store" });
      if (!res.ok) throw new Error("icons.json not found");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("icons.json must be an array");
      icons = data.map(item => ({
        name: String(item.name),
        category: String(item.category),
        path: `icons/${item.category}/${item.name}.svg`
      }));
    } catch (err) {
      console.warn("Could not load icons/icons.json — falling back to built-in list.", err);
      icons = FALLBACK_ICONS.map(i => ({ ...i, path: `icons/${i.category}/${i.name}.svg` }));
    }
  }

  function populateCategories() {
    const cats = Array.from(new Set(icons.map(i => i.category))).sort();
    // clear existing but keep 'all' option
    categoryFilter.innerHTML = `<option value="all">All categories</option>`;
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = capitalize(c);
      categoryFilter.appendChild(opt);
    });
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderIcons(list) {
    iconGrid.innerHTML = "";
    if (!list.length) {
      iconGrid.innerHTML = `<div class="no-results" style="grid-column:1/-1; text-align:center; color:var(--muted)">No icons found.</div>`;
      updateCounts(0, 0);
      return;
    }
    list.forEach(icon => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "icon-card";
      card.setAttribute("title", `Copy CDN link for ${icon.name}`);
      card.innerHTML = `
        <img src="${icon.path}" alt="${icon.name} icon" loading="lazy" />
        <div class="name">${icon.name}</div>
        <div class="cat">${icon.category}</div>
      `;
      card.addEventListener("click", () => onCopy(icon, card));
      iconGrid.appendChild(card);
    });
    updateCounts(list.length, icons.length);
  }

  function updateCounts(filtered, total) {
    if (!countsEl) return;
    countsEl.textContent = `${filtered} / ${total}`;
  }

  function onCopy(icon, cardEl) {
    const cdnUrl = `${CDN_BASE}/icons/${icon.category}/${icon.name}.svg`;
    navigator.clipboard.writeText(cdnUrl).then(() => {
      showToast(`Copied: ${icon.name}`);
      // quick visual feedback on card
      cardEl.classList.add("copied");
      const prev = cardEl.innerHTML;
      cardEl.innerHTML = `<div style="font-weight:700">✅ Copied!</div>`;
      setTimeout(() => (cardEl.innerHTML = prev), 900);
    }).catch(() => showToast("Could not copy — permission denied"));
  }

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1400);
  }

  function applyFilters() {
    const q = (searchInput.value || "").trim().toLowerCase();
    const cat = categoryFilter.value || "all";
    const filtered = icons.filter(i => {
      const matchQ = i.name.toLowerCase().includes(q);
      const matchCat = cat === "all" || i.category === cat;
      return matchQ && matchCat;
    });
    renderIcons(filtered);
  }

  // Wire events
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);

  // main startup
  (async function init() {
    await loadManifest();
    populateCategories();
    applyFilters();
  })();
});
