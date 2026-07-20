function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  var sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open', sidebarOpen);
    sidebar.classList.toggle('closed', !sidebarOpen);
  }
  localStorage.setItem(SIDEBAR_KEY, sidebarOpen ? '1' : '0');
  updateToggleIcon();
}

function updateToggleIcon() {
  var btn = document.getElementById('sidebar-toggle');
  if (btn) {
    var path = btn.querySelector('path');
    if (path) {
      path.setAttribute('d', sidebarOpen
        ? 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'
        : 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z');
    }
  }
  var bottomBtn = document.getElementById('sidebar-toggle-bottom');
  if (bottomBtn) {
    var path2 = bottomBtn.querySelector('path');
    if (path2) {
      path2.setAttribute('d', sidebarOpen
        ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
        : 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z');
    }
    var span = bottomBtn.querySelector('span');
    if (span) span.textContent = sidebarOpen ? '折りたたむ' : '展開する';
  }
}

function setupSidebarHandlers() {
  var newNoteBtn = document.getElementById('new-note-btn');
  var newFolderBtn = document.getElementById('new-folder-btn');
  var toggleBtn = document.getElementById('sidebar-toggle');

  if (newNoteBtn) {
    newNoteBtn.addEventListener('click', function () {
      var parentId = 'root';
      if (activeFolderId) {
        var folder = findNode(activeFolderId, notesData);
        if (folder && folder.type === 'folder') parentId = folder.id;
      } else if (activeNoteId) {
        var parent = findParent(activeNoteId, notesData);
        if (parent && parent.type === 'folder') parentId = parent.id;
      }
      var newNote = addItem(parentId, 'note');
      renderTree();
      if (newNote) {
        openNote(newNote.id);
        startRename(newNote.id);
      }
    });
  }

  if (newFolderBtn) {
    newFolderBtn.addEventListener('click', function () {
      var parentId = 'root';
      if (activeFolderId) {
        var folder = findNode(activeFolderId, notesData);
        if (folder && folder.type === 'folder') parentId = folder.id;
      } else if (activeNoteId) {
        var parent = findParent(activeNoteId, notesData);
        if (parent && parent.type === 'folder') parentId = parent.id;
      }
      var newFolder = addItem(parentId, 'folder');
      renderTree();
      if (newFolder) startRename(newFolder.id);
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebar);
  }

  var toggleBottomBtn = document.getElementById('sidebar-toggle-bottom');
  if (toggleBottomBtn) {
    toggleBottomBtn.addEventListener('click', toggleSidebar);
  }

  var treeContainer = document.getElementById('sidebar-tree');
  if (treeContainer) {
    treeContainer.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    treeContainer.addEventListener('drop', function (e) {
      e.preventDefault();
      if (!draggedId || draggedId === 'root') return;
      moveNode(draggedId, 'root');
      renderTree();
    });
  }
}

function scrollToActive() {
  setTimeout(function () {
    var el = document.querySelector('.tree-item.active');
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, 50);
}

// === Context Menu ===

function showContextMenu(x, y, id) {
  hideContextMenu();

  var node = findNode(id, notesData);
  if (!node) return;

  var menu = document.getElementById('context-menu');
  if (!menu) return;

  menu.innerHTML = '';
  menu.style.display = 'block';

  if (node.type === 'folder') {
    addMenuBtn(menu, '新規メモ', function () {
      var newNote = addItem(id, 'note');
      renderTree();
      if (newNote) {
        startRename(newNote.id);
      }
      hideContextMenu();
    });
    addMenuBtn(menu, '新規フォルダ', function () {
      var newFolder = addItem(id, 'folder');
      renderTree();
      if (newFolder) startRename(newFolder.id);
      hideContextMenu();
    });
    addMenuSep(menu);
  }

  addMenuBtn(menu, '名前を変更', function () {
    startRename(id);
    hideContextMenu();
  });

  var delBtn = document.createElement('button');
  delBtn.className = 'danger';
  delBtn.textContent = '削除';
  delBtn.addEventListener('click', function () {
    var n = findNode(id, notesData);
    if (!n) return;
    var t = n.type === 'folder' ? 'フォルダ' : 'メモ';
    if (confirm('「' + n.name + '」を削除してもよろしいですか？')) {
      deleteItem(id);
      renderTree();
    }
    hideContextMenu();
  });
  menu.appendChild(delBtn);

  var rect = menu.getBoundingClientRect();
  var maxX = window.innerWidth - rect.width;
  var maxY = window.innerHeight - rect.height;
  menu.style.left = Math.min(x, maxX) + 'px';
  menu.style.top = Math.min(y, maxY) + 'px';

  contextMenuNode = menu;

  setTimeout(function () {
    document.addEventListener('click', hideContextMenu, { once: true });
  }, 0);
}

function addMenuBtn(menu, text, cb) {
  var btn = document.createElement('button');
  btn.textContent = text;
  btn.addEventListener('click', cb);
  menu.appendChild(btn);
}

function addMenuSep(menu) {
  var sep = document.createElement('div');
  sep.className = 'context-sep';
  menu.appendChild(sep);
}

function hideContextMenu() {
  if (contextMenuNode) {
    contextMenuNode.style.display = 'none';
    contextMenuNode = null;
  }
}
