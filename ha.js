(function () {
  if (location.hostname !== '192.168.1.130') return;
  var started = Date.now();
  document.documentElement.style.setProperty('--ha-tivi', '1');

  function hideSidebar() {
    try { localStorage.setItem('dockedSidebar', '"always_hidden"'); } catch (e) {}
    try {
      window.dispatchEvent(new CustomEvent('hass-kiosk-mode', { detail: { enable: true } }));
    } catch (e) {}
  }
  var n = 0;
  var t = setInterval(function () {
    hideSidebar();
    if (++n >= 30) { clearInterval(t); setInterval(hideSidebar, 60000); }
  }, 2000);

  function screenSaverOff() {
    try {
      webapis.appcommon.setScreenSaver(webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF);
    } catch (e) {}
  }
  if (window.webapis) screenSaverOff();
  else if (/Tizen/.test(navigator.userAgent)) {
    document.addEventListener('DOMContentLoaded', function () {
      var s = document.createElement('script');
      s.src = '$WEBAPIS/webapis/webapis.js';
      s.onload = screenSaverOff;
      document.head.appendChild(s);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 403) location.reload();
  });

  setInterval(function () {
    if (new Date().getHours() === 4 && Date.now() - started > 2 * 3600 * 1000) location.reload();
  }, 10 * 60 * 1000);
})();
