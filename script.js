const form = document.querySelector('#entry-form');
const entryIdInput = document.querySelector('#entry-id');
const termInput = document.querySelector('#term');
const definitionInput = document.querySelector('#definition');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const entryList = document.querySelector('#entry-list');

let entries = loadEntries();

function loadEntries() {
  const raw = localStorage.getItem('glossary-entries');
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem('glossary-entries', JSON.stringify(entries));
}

function clearForm() {
  entryIdInput.value = '';
  form.reset();
  saveButton.textContent = 'Save Entry';
  cancelButton.hidden = true;
}

function setEditMode(entry) {
  entryIdInput.value = entry.id;
  termInput.value = entry.term;
  definitionInput.value = entry.definition;
  saveButton.textContent = 'Update Entry';
  cancelButton.hidden = false;
  termInput.focus();
}

function renderEntries() {
  if (entries.length === 0) {
    entryList.innerHTML = '<li class="empty">No entries saved yet.</li>';
    return;
  }

  entryList.innerHTML = '';

  entries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'entry-item';

    item.innerHTML = `
      <div class="entry-item-header">
        <h3>${entry.term}</h3>
        <div class="entry-actions">
          <button type="button" class="edit" data-action="edit" data-id="${entry.id}">Edit</button>
          <button type="button" class="delete" data-action="delete" data-id="${entry.id}">Delete</button>
        </div>
      </div>
      <p>${entry.definition}</p>
    `;

    entryList.append(item);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const term = termInput.value.trim();
  const definition = definitionInput.value.trim();

  if (!term || !definition) {
    return;
  }

  const currentId = entryIdInput.value;

  if (currentId) {
    entries = entries.map((entry) =>
      entry.id === currentId ? { ...entry, term, definition } : entry,
    );
  } else {
    entries.unshift({
      id: crypto.randomUUID(),
      term,
      definition,
    });
  }

  saveEntries();
  renderEntries();
  clearForm();
});

entryList.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const { action, id } = target.dataset;
  if (!action || !id) {
    return;
  }

  if (action === 'delete') {
    const shouldDelete = window.confirm('Delete this entry? This action cannot be undone.');
    if (!shouldDelete) {
      return;
    }

    entries = entries.filter((entry) => entry.id !== id);
    saveEntries();
    renderEntries();

    if (entryIdInput.value === id) {
      clearForm();
    }

    return;
  }

  if (action === 'edit') {
    const entryToEdit = entries.find((entry) => entry.id === id);
    if (entryToEdit) {
      setEditMode(entryToEdit);
    }
  }
});

cancelButton.addEventListener('click', () => {
  clearForm();
});

renderEntries();
