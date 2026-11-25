const entries = document.querySelector('.entries');
const preview = document.querySelector('.terminal-preview');
const previewText = preview.querySelector('span');
let hoveredEntry = null;

function updatePreview() {
  const entry = hoveredEntry ?? entries.querySelector('.entry:focus-visible');
  previewText.textContent = entry ? `cd /${entry.hash.slice(1)}` : '';
  preview.hidden = !entry;
}

for (const entry of entries.querySelectorAll('.entry')) {
  entry.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;

    hoveredEntry = entry;
    updatePreview();
  });
  entry.addEventListener('pointerleave', () => {
    hoveredEntry = null;
    updatePreview();
  });
}

entries.addEventListener('focusin', (event) => {
  if (event.target.matches(':focus-visible')) hoveredEntry = null;
  updatePreview();
});
entries.addEventListener('focusout', () => queueMicrotask(updatePreview));
window.addEventListener('blur', () => {
  hoveredEntry = null;
  updatePreview();
});
