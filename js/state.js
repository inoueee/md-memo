var editor = document.getElementById('editor');
var preview = document.getElementById('preview');
var divider = document.getElementById('divider');
var mainContainer = document.getElementById('main-container');
var layoutToggle = document.getElementById('layout-toggle');
var layoutPath = document.querySelector('#layout-icon path');
var exportBtn = document.getElementById('export-btn');
var exportWrapper = document.getElementById('export-wrapper');
var exportDropdown = document.getElementById('export-dropdown');
var editorThemeSelect = document.getElementById('editor-theme-select');
var previewThemeSelect = document.getElementById('preview-theme-select');
var charCount = document.getElementById('char-count');
var lineCount = document.getElementById('line-count');
var wordCount = document.getElementById('word-count');

var isVertical = false;
var isDragging = false;

var editorThemes = [
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'nord', label: 'Nord' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'solarized-light', label: 'Solarized Light' },
  { value: 'tokyo-night', label: 'Tokyo Night' },
  { value: 'ayu-mirage', label: 'Ayu Mirage' }
];

var previewThemes = [
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

var NOTES_KEY = 'md-notes-data';
var ACTIVE_KEY = 'md-notes-active';
var ACTIVE_FOLDER_KEY = 'md-notes-active-folder';
var SIDEBAR_KEY = 'md-sidebar-open';

var notesData = null;
var activeNoteId = null;
var activeFolderId = null;
var sidebarOpen = true;
var saveTimeout = null;
var draggedId = null;
var didDrag = false;
var contextMenuNode = null;

marked.setOptions({
  breaks: true,
  gfm: true
});
