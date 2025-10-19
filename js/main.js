document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("icon-grid");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("category-filter");

  if (!grid) {
    console.error("Error: #icon-grid element not found in DOM.");
    return;
  }

  const categories = ["system", "brand"];
  let icons = [];

  async function loadIcons() {
    for (const category of categories) {
      try {
        const res = await fetch(`icons/${category}/`);
        const text = await res.text();
        const parser = new DOMParser();
        const html = parser.parseFromString(text, "text/html");

        const files = [...html.querySelectorAll("a")]
          .map(a => a.getAttribute("href"))
          .filter(href => href && href.endsWith(".svg"));

        files.forEach(file => {
          const name = file.replace(".svg", "");
          icons.push({ name, category, path: `icons/${category}/${file}` });
        });
      } catch (err) {
        console.error(`Error loading category ${category}:`, err);
      }
    }

    renderIcons(icons);
  }

  function renderIcons(list) {
    if (!grid) return;
    grid.innerHTML = "";
    list.forEach(icon => {
      const card = document.createElement("div");
      card.className = "icon-card";
      card.innerHTML = `
        <img src="${icon.path}" alt="${icon.name}" />
        <div>${icon.name}</div>
        <small>${icon.category}</small>
      `;
      card.addEventListener("click", () => {
        navigator.clipboard.writeText(icon.path);
        card.classList.add("copied");
        card.innerHTML = `<span>✅ Copied!</span>`;
        setTimeout(() => renderIcons(list), 1000);
      });
      grid.appendChild(card);
    });
  }

  function filterIcons() {
    const query = (searchInput?.value || "").toLowerCase();
    const category = categoryFilter?.value || "all";

    const filtered = icons.filter(icon => {
      const matchQuery = icon.name.toLowerCase().includes(query);
      const matchCategory = category === "all" || icon.category === category;
      return matchQuery && matchCategory;
    });

    renderIcons(filtered);
  }

  searchInput?.addEventListener("input", filterIcons);
  categoryFilter?.addEventListener("change", filterIcons);

  await loadIcons();
});
