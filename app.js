const STORAGE_KEY = "teamGlossaryEntries";

const form = document.getElementById("glossary-form");
const termInput = document.getElementById("term-input");
const definitionInput = document.getElementById("definition-input");
const list = document.getElementById("glossary-list");
const message = document.getElementById("message");

let entries = loadEntries();
renderEntries();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const term = termInput.value.trim();
  const definition = definitionInput.value.trim();

  if (!term || !definition) {
    showMessage("Please enter both a term and a definition.");
    return;
  }

  const newEntry = {
    id: Date.now(),
    term,
    definition,
  };

  entries.push(newEntry);
  saveEntries();
  renderEntries();

  form.reset();
  termInput.focus();
  showMessage("");
});

list.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("button[data-id]");
  if (!deleteButton) return;

  const id = Number(deleteButton.dataset.id);
  entries = entries.filter((entry) => entry.id !== id);
  saveEntries();
  renderEntries();
});

function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderEntries() {
  list.innerHTML = "";

  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "glossary-item";

    const textContainer = document.createElement("div");

    const termEl = document.createElement("div");
    termEl.className = "term";
    termEl.textContent = entry.term;

    const definitionEl = document.createElement("div");
    definitionEl.className = "definition";
    definitionEl.textContent = entry.definition;

    textContainer.append(termEl, definitionEl);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.dataset.id = String(entry.id);
    deleteButton.textContent = "Delete";

    item.append(textContainer, deleteButton);
    list.appendChild(item);
  });
}

function showMessage(text) {
  message.textContent = text;
}
