function initNotes() {
  notesData = loadNotes();
  sidebarOpen = localStorage.getItem(SIDEBAR_KEY) !== '0';

  var sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open', sidebarOpen);
    sidebar.classList.toggle('closed', !sidebarOpen);
  }
  updateToggleIcon();

  activeNoteId = localStorage.getItem(ACTIVE_KEY);
  activeFolderId = localStorage.getItem(ACTIVE_FOLDER_KEY);

  if (activeNoteId) {
    var note = findNode(activeNoteId, notesData);
    if (note && note.type === 'note') {
      editor.value = note.content || '';
      var titleInput = document.getElementById('note-title');
      if (titleInput) titleInput.value = note.name || '';
      updatePreview();
      renderTree();
      scrollToActive();
      setupAutoSave();
      setupSidebarHandlers();
      return;
    }
    activeNoteId = null;
  }

  if (notesData.children && notesData.children.length > 0) {
    var first = findFirstNote(notesData);
    if (first) {
      activeNoteId = first.id;
      localStorage.setItem(ACTIVE_KEY, activeNoteId);
      editor.value = first.content || '';
      var titleInput = document.getElementById('note-title');
      if (titleInput) titleInput.value = first.name || '';
      updatePreview();
      renderTree();
      setupAutoSave();
      setupSidebarHandlers();
      return;
    }
  }

  var defaultContent = '# mdメモ帳\n\nMarkdownでメモを書き始めてください。\n\n---\n\n## 書式例\n\n**太字**、*斜体*、~~取り消し線~~\n\n```javascript\nconsole.log("Hello, mdメモ帳!");\n```\n\n> 引用文\n\n- 箇条書き 1\n- 箇条書き 2\n\n1. 番号付きリスト 1\n2. 番号付きリスト 2\n\n[リンク](https://example.com)';

  var initialNote = {
    id: uid(),
    name: 'はじめに',
    type: 'note',
    content: defaultContent,
    created: Date.now(),
    updated: Date.now()
  };

  if (!notesData.children) notesData.children = [];
  notesData.children.push(initialNote);
  activeNoteId = initialNote.id;
  localStorage.setItem(ACTIVE_KEY, activeNoteId);
  saveNotes();

  editor.value = defaultContent;
  var titleInput = document.getElementById('note-title');
  if (titleInput) titleInput.value = initialNote.name;
  updatePreview();
  renderTree();
  setupAutoSave();
  setupSidebarHandlers();
}

editorThemeSelect.value = 'cyberpunk';
previewThemeSelect.value = 'github-dark';
editor.setAttribute('data-theme', 'cyberpunk');
preview.setAttribute('data-theme', 'github-dark');
syncTitleBg();

initNotes();
loadAdSense();
