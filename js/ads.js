function initAds() {
  var config = window.APP_CONFIG;
  if (!config || !config.ads || !config.ads.enabled) return;

  var headerContainer = document.getElementById('ad-header');
  if (headerContainer && config.ads.header && config.ads.header.enabled !== false) {
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'inline-block';
    ins.style.width = '100%';
    ins.style.minHeight = '90px';
    ins.setAttribute('data-ad-client', 'ca-pub-' + config.ads.publisherId);
    ins.setAttribute('data-ad-slot', config.ads.header.slot);
    if (config.ads.header.format) {
      ins.setAttribute('data-ad-format', config.ads.header.format);
    }
    if (config.ads.header.responsive) {
      ins.setAttribute('data-full-width-responsive', 'true');
    }
    headerContainer.appendChild(ins);
    (adsbygoogle = window.adsbygoogle || []).push({});
  }

  var sidebarContainer = document.getElementById('ad-sidebar');
  if (sidebarContainer && config.ads.sidebar && config.ads.sidebar.enabled !== false) {
    var ins2 = document.createElement('ins');
    ins2.className = 'adsbygoogle';
    ins2.style.display = 'inline-block';
    ins2.style.width = '100%';
    ins2.style.minHeight = '250px';
    ins2.setAttribute('data-ad-client', 'ca-pub-' + config.ads.publisherId);
    ins2.setAttribute('data-ad-slot', config.ads.sidebar.slot);
    if (config.ads.sidebar.format) {
      ins2.setAttribute('data-ad-format', config.ads.sidebar.format);
    }
    if (config.ads.sidebar.responsive) {
      ins2.setAttribute('data-full-width-responsive', 'true');
    }
    sidebarContainer.appendChild(ins2);
    (adsbygoogle = window.adsbygoogle || []).push({});
  }
}

function loadAdSense() {
  var config = window.APP_CONFIG;
  if (!config || !config.ads || !config.ads.enabled || !config.ads.publisherId) return;

  var s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-' + config.ads.publisherId;
  s.onload = function () {
    initAds();
  };
  s.onerror = function () {
    console.error('AdSense script failed to load');
  };
  document.head.appendChild(s);
}
