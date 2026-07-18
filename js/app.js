(function () {
  'use strict';

  // ============================================================
  // ADS MANAGEMENT
  // ============================================================

  function initAds() {
    var config = window.APP_CONFIG;
    if (!config || !config.ads || !config.ads.enabled) return;

    var adsbygoogle = window.adsbygoogle || [];

    // ヘッダー下の広告
    var headerContainer = document.getElementById('ad-header');
    if (headerContainer && config.ads.header) {
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      if (config.ads.header.format) {
        ins.setAttribute('data-ad-format', config.ads.header.format);
      }
      if (config.ads.header.responsive) {
        ins.setAttribute('data-full-width-responsive', 'true');
      }
      ins.setAttribute('data-ad-client', 'ca-pub-' + config.ads.publisherId);
      ins.setAttribute('data-ad-slot', config.ads.header.slot);
      headerContainer.appendChild(ins);
      try { adsbygoogle.push({}); } catch (e) {}
    }

    // サイドバー内の広告
    var sidebarContainer = document.getElementById('ad-sidebar');
    if (sidebarContainer && config.ads.sidebar) {
      var ins2 = document.createElement('ins');
      ins2.className = 'adsbygoogle';
      ins2.style.display = 'block';
      if (config.ads.sidebar.format) {
        ins2.setAttribute('data-ad-format', config.ads.sidebar.format);
      }
      if (config.ads.sidebar.responsive) {
        ins2.setAttribute('data-full-width-responsive', 'true');
      }
      ins2.setAttribute('data-ad-client', 'ca-pub-' + config.ads.publisherId);
      ins2.setAttribute('data-ad-slot', config.ads.sidebar.slot);
      sidebarContainer.appendChild(ins2);
      try { adsbygoogle.push({}); } catch (e) {}
    }
  }

  // AdSenseスクリプトを読み込む
  function loadAdSense() {
    var config = window.APP_CONFIG;
    if (!config || !config.ads || !config.ads.enabled || !config.ads.publisherId) return;

    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-' + config.ads.publisherId;
    document.head.appendChild(s);
  }

  const editor = document.getElementById('editor');
  const preview = document.getElementById('preview');
  const divider = document.getElementById('divider');
  const mainContainer = document.getElementById('main-container');
  const layoutToggle = document.getElementById('layout-toggle');
  const layoutPath = document.querySelector('#layout-icon path');
  const exportBtn = document.getElementById('export-btn');
  const exportWrapper = document.getElementById('export-wrapper');
  const exportDropdown = document.getElementById('export-dropdown');
  const editorThemeSelect = document.getElementById('editor-theme-select');
  const previewThemeSelect = document.getElementById('preview-theme-select');
  const charCount = document.getElementById('char-count');
  const lineCount = document.getElementById('line-count');
  const wordCount = document.getElementById('word-count');

  let isVertical = false;
  let isDragging = false;

  const editorThemes = [
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'nord', label: 'Nord' },
    { value: 'github-dark', label: 'GitHub Dark' },
    { value: 'solarized-light', label: 'Solarized Light' },
    { value: 'tokyo-night', label: 'Tokyo Night' },
    { value: 'ayu-mirage', label: 'Ayu Mirage' }
  ];

  const previewThemes = [
    { value: 'github', label: 'GitHub' },
    { value: 'github-dark', label: 'GitHub Dark' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'nord', label: 'Nord' },
    { value: 'simple', label: 'Simple' }
  ];

  editorThemes.forEach(function (t) {
    var opt = document.createElement('option');
    opt.value = t.value;
    opt.textContent = t.label;
    editorThemeSelect.appendChild(opt);
  });

  previewThemes.forEach(function (t) {
    var opt = document.createElement('option');
    opt.value = t.value;
    opt.textContent = t.label;
    previewThemeSelect.appendChild(opt);
  });

  editorThemeSelect.value = 'cyberpunk';
  previewThemeSelect.value = 'github-dark';
  editor.setAttribute('data-theme', 'cyberpunk');
  preview.setAttribute('data-theme', 'github-dark');
  syncTitleBg();

  marked.setOptions({
    breaks: true,
    gfm: true
  });

  function updatePreview() {
    var html = marked.parse(editor.value);
    preview.innerHTML = html;
    preview.querySelectorAll('pre code').forEach(function (block) {
      hljs.highlightElement(block);
    });
    updateStats();
  }

  function updateStats() {
    var text = editor.value;
    charCount.textContent = text.length + ' 文字';
    lineCount.textContent = (text.split('\n').length) + ' 行';
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCount.textContent = words + ' 単語';
  }

  editor.addEventListener('input', updatePreview);

  function wrapSelection(prefix, suffix, placeholder) {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var text = editor.value;
    var selected = text.substring(start, end);
    var insertText = selected || placeholder || '';
    var newText = prefix + insertText + suffix;
    editor.focus();
    document.execCommand('insertText', false, newText);
    if (!selected) {
      editor.setSelectionRange(
        start + prefix.length,
        start + prefix.length + insertText.length
      );
    }
    editor.dispatchEvent(new Event('input'));
  }

  function insertTextAtCursor(text) {
    editor.focus();
    document.execCommand('insertText', false, text);
    editor.dispatchEvent(new Event('input'));
  }

  function getToolbarCmd(cmd) {
    switch (cmd) {
      case 'bold': wrapSelection('**', '**', 'テキスト'); break;
      case 'italic': wrapSelection('*', '*', 'テキスト'); break;
      case 'strike': wrapSelection('~~', '~~', 'テキスト'); break;
      case 'h1': wrapSelection('# ', '', '見出し1'); break;
      case 'h2': wrapSelection('## ', '', '見出し2'); break;
      case 'h3': wrapSelection('### ', '', '見出し3'); break;
      case 'code': wrapSelection('`', '`', 'code'); break;
      case 'codeblock':
        wrapSelection('```\n', '\n```', 'コードブロック');
        break;
      case 'link':
        (function () {
          var url = prompt('リンク先URLを入力:');
          if (url !== null && url.trim()) {
            wrapSelection('[', '](' + url.trim() + ')', 'リンクテキスト');
          }
        })();
        break;
      case 'image':
        (function () {
          var url = prompt('画像URLを入力:');
          if (url !== null && url.trim()) {
            wrapSelection('![', '](' + url.trim() + ')', '代替テキスト');
          }
        })();
        break;
      case 'blockquote': wrapSelection('> ', '', '引用文'); break;
      case 'ul': wrapSelection('- ', '', '箇条書き'); break;
      case 'ol': wrapSelection('1. ', '', '項目'); break;
      case 'hr': insertTextAtCursor('\n---\n'); break;
    }
  }

  document.querySelectorAll('[data-cmd]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      getToolbarCmd(btn.dataset.cmd);
    });
  });

  layoutToggle.addEventListener('click', function () {
    isVertical = !isVertical;
    mainContainer.style.flexDirection = isVertical ? 'column' : 'row';
    layoutPath.setAttribute('d', isVertical
      ? 'M5 3h14v18H5V3zm2 2v4h10V5H7zm0 6v4h10v-4H7zm0 6v2h10v-2H7z'
      : 'M3 5v14h18V5H3zm8 12H5v-4h6v4zm0-6H5V7h6v4zm8 6h-6v-4h6v4zm0-6h-6V7h6v4z');
    mainContainer.style.setProperty('--split-ratio', '50%');
  });

  divider.addEventListener('mousedown', function (e) {
    isDragging = true;
    divider.classList.add('active');
    document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var rect = mainContainer.getBoundingClientRect();
    var pos;
    if (isVertical) {
      pos = ((e.clientY - rect.top) / rect.height) * 100;
    } else {
      pos = ((e.clientX - rect.left) / rect.width) * 100;
    }
    pos = Math.max(20, Math.min(80, pos));
    mainContainer.style.setProperty('--split-ratio', pos + '%');
  });

  document.addEventListener('mouseup', function () {
    if (isDragging) {
      isDragging = false;
      divider.classList.remove('active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  editorThemeSelect.addEventListener('change', function () {
    editor.setAttribute('data-theme', editorThemeSelect.value);
    syncTitleBg();
  });

  previewThemeSelect.addEventListener('change', function () {
    preview.setAttribute('data-theme', previewThemeSelect.value);
  });

  function syncTitleBg() {
    var title = document.getElementById('note-title');
    if (title && editor) {
      title.style.backgroundColor = getComputedStyle(editor).backgroundColor;
    }
  }

  function getTimestamp() {
    var now = new Date();
    return '' + now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0');
  }

  function exportMarkdown() {
    var content = editor.value;
    var blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'mdメモ_' + getTimestamp() + '.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    var original = document.getElementById('preview');
    var clone = original.cloneNode(true);
    clone.setAttribute('data-theme', 'github');
    clone.style.position = 'relative';
    clone.style.overflow = 'visible';
    clone.style.height = 'auto';
    clone.style.maxHeight = 'none';
    clone.style.width = original.offsetWidth + 'px';

    var wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.width = original.offsetWidth + 'px';
    wrapper.style.zIndex = '-1';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    var contentWidth = clone.scrollWidth;
    var pdfWidthMm = 190;
    var pdfHeightMm = 277;
    var pageHeightPx = contentWidth * pdfHeightMm / pdfWidthMm;

    // Prevent elements from breaking across pages
    var blocks = clone.querySelectorAll('h1, h2, h3, h4, h5, h6, p, pre, blockquote, table, ul, ol, li, figure, img, hr');
    for (var i = 0; i < blocks.length; i++) {
      blocks[i].style.breakInside = 'avoid';
      blocks[i].style.pageBreakInside = 'avoid';
    }

    var children = Array.from(clone.children);
    if (children.length === 0) {
      document.body.removeChild(wrapper);
      var doc = new jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      doc.save('mdメモ_' + getTimestamp() + '.pdf');
      return;
    }

    // Measure vertical space per child (including margins)
    var slots = [];
    for (var i = 0; i < children.length; i++) {
      if (i < children.length - 1) {
        slots.push(children[i + 1].offsetTop - children[i].offsetTop);
      } else {
        slots.push(children[i].offsetHeight);
      }
    }

    // Distribute children into page groups
    var pageGroups = [];
    var currentGroup = [];
    var currentHeight = 0;

    for (var i = 0; i < children.length; i++) {
      if (slots[i] > pageHeightPx) {
        if (currentGroup.length > 0) {
          pageGroups.push(currentGroup);
          currentGroup = [];
          currentHeight = 0;
        }
        pageGroups.push([children[i]]);
        continue;
      }
      if (currentGroup.length > 0 && currentHeight + slots[i] > pageHeightPx) {
        pageGroups.push(currentGroup);
        currentGroup = [children[i]];
        currentHeight = slots[i];
      } else {
        currentGroup.push(children[i]);
        currentHeight += slots[i];
      }
    }
    if (currentGroup.length > 0) {
      pageGroups.push(currentGroup);
    }

    var doc = new jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    function renderPage(index) {
      if (index >= pageGroups.length) {
        document.body.removeChild(wrapper);
        doc.save('mdメモ_' + getTimestamp() + '.pdf');
        return;
      }

      for (var i = 0; i < children.length; i++) {
        children[i].style.display = 'none';
      }
      var group = pageGroups[index];
      for (var i = 0; i < group.length; i++) {
        group[i].style.display = '';
      }

      html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        width: contentWidth
      }).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png');
        if (index > 0) {
          doc.addPage();
        }
        var imgHeight = Math.min((canvas.height * pdfWidthMm) / canvas.width, pdfHeightMm);
        doc.addImage(imgData, 'PNG', 10, 10, pdfWidthMm, imgHeight);
        renderPage(index + 1);
      }).catch(function (err) {
        console.error('PDF page render failed:', err);
        renderPage(index + 1);
      });
    }

    renderPage(0);
  }

  exportBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = exportDropdown.style.display === 'block';
    exportDropdown.style.display = isOpen ? 'none' : 'block';
  });

  exportDropdown.addEventListener('click', function (e) {
    var type = e.target.dataset.export;
    if (!type) return;
    exportDropdown.style.display = 'none';
    if (type === 'md') {
      exportMarkdown();
    } else if (type === 'pdf') {
      exportPdf();
    }
  });

  document.addEventListener('click', function () {
    exportDropdown.style.display = 'none';
  });

  editor.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      var start = editor.selectionStart;
      var text = editor.value;
      var lineStart = text.lastIndexOf('\n', start - 1) + 1;
      var lineBeforeCursor = text.substring(lineStart, start);

      var bulletMatch = lineBeforeCursor.match(/^(\s*)([-*+])\s(.*)$/);
      if (bulletMatch) {
        e.preventDefault();
        if (bulletMatch[3].trim() === '') {
          editor.setSelectionRange(lineStart, start);
          document.execCommand('insertText', false, '\n');
        } else {
          document.execCommand('insertText', false, '\n' + bulletMatch[1] + '- ');
        }
        editor.dispatchEvent(new Event('input'));
        return;
      }

      var numMatch = lineBeforeCursor.match(/^(\s*)(\d+)\.\s(.*)$/);
      if (numMatch) {
        e.preventDefault();
        if (numMatch[3].trim() === '') {
          editor.setSelectionRange(lineStart, start);
          document.execCommand('insertText', false, '\n');
        } else {
          document.execCommand('insertText', false, '\n' + numMatch[1] + (parseInt(numMatch[2], 10) + 1) + '. ');
        }
        editor.dispatchEvent(new Event('input'));
        return;
      }
    }

    if (e.ctrlKey) {
      switch (e.key) {
        case 'b': e.preventDefault(); getToolbarCmd('bold'); break;
        case 'i': e.preventDefault(); getToolbarCmd('italic'); break;
        case 'k': e.preventDefault(); getToolbarCmd('link'); break;
        case 's': e.preventDefault(); saveCurrentNote(); exportMarkdown(); break;
      }
    }
  });

  // ============================================================
  // NOTE MANAGEMENT SYSTEM
  // ============================================================

  const NOTES_KEY = 'md-notes-data';
  const ACTIVE_KEY = 'md-notes-active';
  const SIDEBAR_KEY = 'md-sidebar-open';

  let notesData = null;
  let activeNoteId = null;
  let sidebarOpen = true;
  let saveTimeout = null;

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

  // === Tree Rendering ===

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

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        node.expanded = !node.expanded;
        saveNotes();
        renderTree();
      });

      nameSpan.addEventListener('click', function (e) {
        e.stopPropagation();
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

  var draggedId = null;

  function setupDragHandlers(item, id) {
    item.draggable = true;

    item.addEventListener('dragstart', function (e) {
      draggedId = id;
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

  // === Context Menu ===

  var contextMenuNode = null;

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

  // === Sidebar Toggle ===

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

  // === Sidebar Event Handlers ===

  function setupSidebarHandlers() {
    var newNoteBtn = document.getElementById('new-note-btn');
    var newFolderBtn = document.getElementById('new-folder-btn');
    var toggleBtn = document.getElementById('sidebar-toggle');

    if (newNoteBtn) {
      newNoteBtn.addEventListener('click', function () {
        var parentId = 'root';
        if (activeNoteId) {
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
        var newFolder = addItem('root', 'folder');
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

    // Drop on tree (handles drops on notes, folders stopped by item handler)
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

  // === Initialization ===

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

    // Auto-select first note if any exist
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

    // Create initial note with default content
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

  // Start the note system
  initNotes();

  // Start ads
  loadAdSense();
  initAds();

})();
