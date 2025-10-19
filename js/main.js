// Simulate your icon database (replace with dynamic JSON if needed)
const icons = [
  { name: "check", category: "system" },
  { name: "close", category: "system" },
  { name: "edit", category: "system" },
  { name: "facebook", category: "social" },
  { name: "twitter", category: "social" },
];

const grid = document.getElementById("iconGrid");
const searchInput = document.getElementById("search");

function renderIcons(filter = "") {
  grid.innerHTML = "";
  icons
    .filter(name => name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(name => {
      const card = document.createElement("div");
      card.className = "icon-card";
      card.innerHTML = `
        <img src="icons/${name}.svg" alt="${name} icon">
        <p>${name}</p>
      `;
      card.addEventListener("click", () => copyIconLink(name));
      grid.appendChild(card);
    });
}

function copyIconLink(name) {
  const url = `https://cdn.jsdelivr.net/gh/yourusername/icon-base/icons/${name}.svg`;
  navigator.clipboard.writeText(url);
  alert(`Copied link:\n${url}`);
}

searchInput.addEventListener("input", e => renderIcons(e.target.value));
renderIcons();
