const icons = [
  { name: "checkmark", category: "system" },
  { name: "close", category: "system" },
  { name: "facebook", category: "brand" },
  { name: "twitter", category: "brand" },
];

const grid = document.getElementById("iconGrid");
const searchInput = document.getElementById("search");

function renderIcons(filter = "") {
  grid.innerHTML = "";

  icons
    .filter(icon =>
      icon.name.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(icon => {
      const card = document.createElement("div");
      card.className = "icon-card";
      const iconPath = `icons/${icon.category}/${icon.name}.svg`;

      card.innerHTML = `
        <img src="${iconPath}" alt="${icon.name} icon">
        <p>${icon.name}</p>
      `;

      card.addEventListener("click", () => copyIconLink(icon));
      grid.appendChild(card);
    });
}

function copyIconLink(icon) {
  const url = `https://cdn.jsdelivr.net/gh/morne-esterhuizen/icon-base/icons/${icon.category}/${icon.name}.svg`;
  navigator.clipboard.writeText(url);
  alert(`Copied link:\n${url}`);
}

searchInput.addEventListener("input", e => renderIcons(e.target.value));
renderIcons();
