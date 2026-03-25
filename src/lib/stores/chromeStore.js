// chromeStore.js — from useChromeHooks (react-source/core/ui.js L1550-1642)
// Factory: createChromeStore(campId)
import { writable } from 'svelte/store';

const TOAST_MS = 2500;

export function createChromeStore(campId) {
  const toast           = writable(null);
  const updateAvailable = writable(false);
  const showSafariWarn  = writable(false);
  const showIosInstall  = writable(false);
  const showPwaNudge    = writable(false);
  const isOnline        = writable(typeof navigator !== 'undefined' ? navigator.onLine !== false : true);

  let toastTimer = null;
  let deferredInstallPrompt = null;

  function showToast(msg) {
    toast.set(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.set(null), TOAST_MS);
  }

  function dismissPwaNudge() {
    showPwaNudge.set(false);
    try { localStorage.setItem('pwa_nudge_dismissed', 'true'); } catch (e) {}
  }

  function installPwa() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(() => {
      deferredInstallPrompt = null;
      showPwaNudge.set(false);
    });
  }

  // PWA install nudge
  function initPwaNudge() {
    if (typeof window === 'undefined') return () => {};
    let dismissed = false;
    try { dismissed = !!localStorage.getItem('pwa_nudge_dismissed'); } catch (e) {}
    if (dismissed) return () => {};
    let visits = 0;
    try {
      visits = (parseInt(localStorage.getItem('visit_count_' + campId) || '0', 10) || 0) + 1;
      localStorage.setItem('visit_count_' + campId, String(visits));
    } catch (e) {}
    function onBeforeInstall(e) {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (visits >= 2) showPwaNudge.set(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }

  // SW update detection
  function initSwUpdate() {
    if (typeof window === 'undefined') return () => {};
    window.__showUpdateToast = () => updateAvailable.set(true);
    return () => { delete window.__showUpdateToast; };
  }

  // Safari/iOS detection
  function initBrowserDetect() {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    const isStandalone = ('standalone' in navigator) && navigator.standalone;
    if ((isIOS || isSafari) && !isStandalone) {
      let warnDismissed = false;
      try { warnDismissed = !!localStorage.getItem('safari_warn_dismissed'); } catch (e) {}
      if (!warnDismissed) showSafariWarn.set(true);
    }
    if (isIOS && isSafari && !isStandalone) {
      let iosDismissed = false;
      try { iosDismissed = !!localStorage.getItem('ios_install_dismissed'); } catch (e) {}
      if (!iosDismissed) showIosInstall.set(true);
    }
  }

  // Online/offline
  function initOnlineStatus() {
    if (typeof window === 'undefined') return () => {};
    function onOnline()  { isOnline.set(true); }
    function onOffline() { isOnline.set(false); }
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }

  // init() — call from onMount in parent component
  function init() {
    const cleanupPwa    = initPwaNudge();
    const cleanupSw     = initSwUpdate();
    initBrowserDetect();
    const cleanupOnline = initOnlineStatus();
    return () => {
      cleanupPwa();
      cleanupSw();
      cleanupOnline();
      if (toastTimer) clearTimeout(toastTimer);
    };
  }

  return {
    toast, updateAvailable, showSafariWarn, showIosInstall, showPwaNudge, isOnline,
    showToast, dismissPwaNudge, installPwa, init,
  };
}
