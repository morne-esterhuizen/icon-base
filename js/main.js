// Simulate your icon database (replace with dynamic JSON if needed)
const icons = [
  { name: "check", category: "system" },
  { name: "close", category: "system" },
  { name: "edit", category: "system" },
  { name: "facebook", category: "social" },
  { name: "twitter", category: "social" },
];


// Your CDN base URL
const CDN_BASE = "https://cdn.jsdelivr.net/gh/morne-esterhuizen/icon-base@1.0.1/icons/";

const iconGrid = document.getElementById("iconGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Render icons
function renderIcons() {
  const query = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = icons.filter(icon => {
    const matchesCategory = category === "all" || icon.category === category;
    const matchesQuery = icon.name.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  iconGrid.innerHTML = filtered.map(icon => {
    const src = `${CDN_BASE}/${icon.category}/${icon.name}.svg`;
    return `
      <div class="icon-card">
        <img src="${src}" alt="${icon.name}" />
        <p>${icon.name}</p>
        <div class="icon-actions">
          <button onclick="copyText('${src}')">Copy CDN</button>
          <button onclick="copySVG('${src}')">Copy SVG</button>
          <a href="${src}" download><button>Download</button></a>
        </div>
      </div>
    `;
  }).join("");
}

async function copySVG(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    await navigator.clipboard.writeText(text);
    alert("SVG copied to clipboard!");
  } catch (err) {
    alert("Failed to copy SVG.");
  }
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  alert("CDN URL copied!");
}

searchInput.addEventListener("input", renderIcons);
categoryFilter.addEventListener("change", renderIcons);

renderIcons();
