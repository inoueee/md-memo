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
