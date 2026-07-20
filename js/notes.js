function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function loadNotes() {
  try {
    var data = localStorage.getItem(NOTES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return { id: 'root', name: 'root', type: 'folder', expanded: true, children: [] };
}

function saveNotes() {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notesData));
  } catch (e) {}
}

function findNode(id, node) {
  if (!node) node = notesData;
  if (node.id === id) return node;
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      var found = findNode(id, node.children[i]);
      if (found) return found;
    }
  }
  return null;
}

function findParent(id, node) {
  if (!node) node = notesData;
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i].id === id) return node;
      var found = findParent(id, node.children[i]);
      if (found) return found;
    }
  }
  return null;
}

function collectAllIds(node) {
  var ids = [node.id];
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      ids = ids.concat(collectAllIds(node.children[i]));
    }
  }
  return ids;
}

function findFirstNote(node) {
  if (node.type === 'note') return node;
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      var found = findFirstNote(node.children[i]);
      if (found) return found;
    }
  }
  return null;
}

function addItem(parentId, type) {
  var parent = parentId === 'root' ? notesData : findNode(parentId, notesData);
  if (!parent || parent.type !== 'folder') return null;

  var now = Date.now();
  var item = {
    id: uid(),
    name: type === 'note' ? '新規メモ' : '新規フォルダ',
    type: type,
    created: now,
    updated: now
  };

  if (type === 'folder') {
    item.children = [];
    item.expanded = true;
  } else {
    item.content = '';
  }

  if (!parent.children) parent.children = [];
  parent.children.push(item);
  parent.expanded = true;

  saveNotes();
  return item;
}

function deleteItem(id) {
  if (id === 'root' || !notesData.children) return false;

  var parent = findParent(id, notesData);
  if (!parent || !parent.children) return false;

  var node = findNode(id, notesData);
  if (!node) return false;

  var deletedIds = collectAllIds(node);
  parent.children = parent.children.filter(function (c) { return c.id !== id; });

  var activeDeleted = deletedIds.indexOf(activeNoteId) !== -1;
  if (activeDeleted) {
    activeNoteId = null;
    localStorage.removeItem(ACTIVE_KEY);
    editor.value = '';
    updatePreview();
  }

  saveNotes();
  return true;
}

function renameItem(id, name) {
  var node = findNode(id, notesData);
  if (!node) return false;
  node.name = name;
  node.updated = Date.now();
  saveNotes();
  if (id === activeNoteId) {
    var titleInput = document.getElementById('note-title');
    if (titleInput) titleInput.value = name;
  }
  return true;
}

function moveNode(id, newParentId, insertIndex) {
  if (id === 'root') return false;

  var node = findNode(id, notesData);
  if (!node) return false;

  if (node.type === 'folder') {
    var ids = collectAllIds(node);
    if (ids.indexOf(newParentId) !== -1) return false;
  }

  var oldParent = findParent(id, notesData);
  if (!oldParent || !oldParent.children) return false;

  var newParent = newParentId === 'root' ? notesData : findNode(newParentId, notesData);
  if (!newParent || newParent.type !== 'folder') return false;

  var idx = -1;
  for (var i = 0; i < oldParent.children.length; i++) {
    if (oldParent.children[i].id === id) { idx = i; break; }
  }
  if (idx === -1) return false;
  var removed = oldParent.children.splice(idx, 1)[0];

  if (!newParent.children) newParent.children = [];

  if (newParent === oldParent && insertIndex !== undefined) {
    if (insertIndex > idx) insertIndex--;
  }

  if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= newParent.children.length) {
    newParent.children.splice(insertIndex, 0, removed);
  } else {
    newParent.children.push(removed);
  }
  newParent.expanded = true;

  saveNotes();
  return true;
}

function saveCurrentNote() {
  if (!activeNoteId) return;
  var note = findNode(activeNoteId, notesData);
  if (note && note.type === 'note') {
    note.content = editor.value;
    var titleInput = document.getElementById('note-title');
    if (titleInput) note.name = titleInput.value.trim() || '無題';
    note.updated = Date.now();
    saveNotes();
  }
}

function openNote(id) {
  if (id === activeNoteId) return;

  var note = findNode(id, notesData);
  if (!note || note.type !== 'note') return;

  saveCurrentNote();

  activeNoteId = id;
  localStorage.setItem(ACTIVE_KEY, id);
  editor.value = note.content || '';
  var titleInput = document.getElementById('note-title');
  if (titleInput) titleInput.value = note.name || '';
  updatePreview();
  renderTree();
  scrollToActive();
}

function setupAutoSave() {
  editor.addEventListener('input', function () {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCurrentNote, 400);
  });
  editor.addEventListener('scroll', function () {
    var title = document.getElementById('note-title');
    if (title) {
      title.style.transform = 'translateY(' + (-this.scrollTop) + 'px)';
    }
  });
  var titleInput = document.getElementById('note-title');
  if (titleInput) {
    titleInput.addEventListener('input', function () {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(function () {
        saveCurrentNote();
        renderTree();
      }, 400);
    });
  }
}
