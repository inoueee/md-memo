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

  var slots = [];
  for (var i = 0; i < children.length; i++) {
    if (i < children.length - 1) {
      slots.push(children[i + 1].offsetTop - children[i].offsetTop);
    } else {
      slots.push(children[i].offsetHeight);
    }
  }

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
