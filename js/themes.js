function syncTitleBg() {
  var title = document.getElementById('note-title');
  if (title && editor) {
    title.style.backgroundColor = getComputedStyle(editor).backgroundColor;
  }
}

editorThemeSelect.addEventListener('change', function () {
  editor.setAttribute('data-theme', editorThemeSelect.value);
  syncTitleBg();
});

previewThemeSelect.addEventListener('change', function () {
  preview.setAttribute('data-theme', previewThemeSelect.value);
});
