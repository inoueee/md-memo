function renderTree() {
  var container = document.getElementById('sidebar-tree');
  if (!container) return;
  var scrollTop = container.scrollTop;
  container.innerHTML = '';
  if (notesData.children) {
    for (var i = 0; i < notesData.children.length; i++) {
      renderNode(notesData.children[i], container, 0);
    }
  }
  container.scrollTop = scrollTop;
}

function renderNode(node, container, depth) {
  var item = document.createElement('div');
  item.className = 'tree-item';
  item.dataset.id = node.id;
  item.style.paddingLeft = (12 + depth * 18) + 'px';

  if (node.type === 'folder') {
    item.classList.add('tree-folder');
    if (node.id === activeFolderId) item.classList.add('active');

    var toggle = document.createElement('span');
    toggle.className = 'tree-toggle';
    toggle.textContent = node.expanded ? '▾' : '▸';
    item.appendChild(toggle);

    var icon = document.createElement('span');
    icon.className = 'tree-item-icon';
    icon.innerHTML = node.expanded
      ? '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" fill="currentColor"/></svg>'
      : '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/></svg>';
    item.appendChild(icon);

    var nameSpan = document.createElement('span');
    nameSpan.className = 'tree-name';
    nameSpan.textContent = node.name;
    item.appendChild(nameSpan);

    item.appendChild(createItemActions(node.id));
    container.appendChild(item);

    if (node.expanded && node.children && node.children.length > 0) {
      for (var i = 0; i < node.children.length; i++) {
        renderNode(node.children[i], container, depth + 1);
      }
    }

    item.addEventListener('click', function (e) {
      if (e.target.closest('.tree-actions')) return;
      if (didDrag) return;
      activeFolderId = node.id;
      localStorage.setItem(ACTIVE_FOLDER_KEY, node.id);
      node.expanded = !node.expanded;
      saveNotes();
      renderTree();
    });

  } else {
    item.classList.add('tree-note');
    if (node.id === activeNoteId) item.classList.add('active');

    var icon = document.createElement('span');
    icon.className = 'tree-item-icon';
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" fill="currentColor"/></svg>';
    item.appendChild(icon);

    var nameSpan = document.createElement('span');
    nameSpan.className = 'tree-name';
    nameSpan.textContent = node.name;
    item.appendChild(nameSpan);

    item.appendChild(createItemActions(node.id));
    container.appendChild(item);

    item.addEventListener('click', function (e) {
      if (e.target.closest('.tree-actions') || e.target.closest('.tree-toggle')) return;
      if (didDrag) return;
      openNote(node.id);
    });
  }

  setupDragHandlers(item, node.id);

  item.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, node.id);
  });
}

function createItemActions(id) {
  var actions = document.createElement('div');
  actions.className = 'tree-actions';

  var renameBtn = document.createElement('button');
  renameBtn.className = 'rename-btn';
  renameBtn.title = '名前を変更';
  renameBtn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>';

  var delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.title = '削除';
  delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>';

  renameBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    hideContextMenu();
    startRename(id);
  });

  delBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    hideContextMenu();
    var node = findNode(id, notesData);
    if (!node) return;
    var type = node.type === 'folder' ? 'フォルダ' : 'メモ';
    if (confirm('「' + node.name + '」を削除してもよろしいですか？')) {
      deleteItem(id);
      renderTree();
    }
  });

  actions.appendChild(renameBtn);
  actions.appendChild(delBtn);
  return actions;
}

// === Drag & Drop ===

function setupDragHandlers(item, id) {
  item.draggable = true;

  item.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    didDrag = false;
  });

  item.addEventListener('dragstart', function (e) {
    draggedId = id;
    didDrag = true;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    var n = findNode(id, notesData);
    if (n) {
      e.dataTransfer.setDragImage(item, 0, item.offsetHeight / 2);
    }
    setTimeout(function () { item.classList.add('dragging'); }, 0);
  });

  item.addEventListener('dragend', function (e) {
    item.classList.remove('dragging');
    document.querySelectorAll('.tree-item.drag-over-before, .tree-item.drag-over-after, .tree-item.drag-over-into').forEach(function (el) {
      el.classList.remove('drag-over-before', 'drag-over-after', 'drag-over-into');
    });
    draggedId = null;
  });

  item.addEventListener('dragover', function (e) {
    if (!draggedId || draggedId === this.dataset.id) return;

    var targetId = this.dataset.id;
    var targetNode = findNode(targetId, notesData);
    if (!targetNode) return;

    var draggedNode = findNode(draggedId, notesData);
    if (!draggedNode) return;
    if (draggedNode.type === 'folder') {
      var ids = collectAllIds(draggedNode);
      if (ids.indexOf(targetId) !== -1) return;
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    var rect = this.getBoundingClientRect();
    var y = (e.clientY - rect.top) / rect.height;

    this.classList.remove('drag-over-before', 'drag-over-after', 'drag-over-into');

    if (y < 0.25) {
      this.classList.add('drag-over-before');
    } else if (y > 0.75) {
      this.classList.add('drag-over-after');
    } else if (targetNode.type === 'folder') {
      this.classList.add('drag-over-into');
    } else {
      this.classList.add('drag-over-after');
    }
  });

  item.addEventListener('dragleave', function (e) {
    this.classList.remove('drag-over-before', 'drag-over-after', 'drag-over-into');
  });

  item.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over-before', 'drag-over-after', 'drag-over-into');
    if (!draggedId || draggedId === this.dataset.id) return;

    var targetId = this.dataset.id;
    var targetNode = findNode(targetId, notesData);
    if (!targetNode) return;

    var parent = findParent(targetId, notesData);
    var parentId = parent ? parent.id : 'root';

    if (this.classList.contains('drag-over-before')) {
      var p = parent || notesData;
      var insertIdx = p.children.findIndex(function (c) { return c.id === targetId; });
      if (insertIdx !== -1) {
        moveNode(draggedId, parentId, insertIdx);
        renderTree();
      }
    } else if (this.classList.contains('drag-over-into')) {
      moveNode(draggedId, targetId);
      renderTree();
    } else {
      var p2 = parent || notesData;
      var insertIdx2 = p2.children.findIndex(function (c) { return c.id === targetId; });
      if (insertIdx2 !== -1) {
        moveNode(draggedId, parentId, insertIdx2 + 1);
        renderTree();
      }
    }
  });
}

// === Inline Rename ===

function startRename(id) {
  var item = document.querySelector('.tree-item[data-id="' + id + '"]');
  if (!item) return;

  var nameSpan = item.querySelector('.tree-name');
  if (!nameSpan) return;

  var node = findNode(id, notesData);
  if (!node) return;

  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'tree-rename';
  input.value = node.name;

  nameSpan.replaceWith(input);
  input.focus();
  input.select();

  function finishRename() {
    var newName = input.value.trim() || '無題';
    renameItem(id, newName);
    renderTree();
    var activeEl = document.querySelector('.tree-item.active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }

  input.addEventListener('blur', finishRename);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
    if (e.key === 'Escape') {
      input.value = node.name;
      input.blur();
    }
  });
}
