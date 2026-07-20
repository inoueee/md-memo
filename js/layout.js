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
