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

editor.addEventListener('input', updatePreview);

document.querySelectorAll('[data-cmd]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    getToolbarCmd(btn.dataset.cmd);
  });
});
