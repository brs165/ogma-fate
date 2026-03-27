// chromeStore.js — Chrome: toast queue, theme toggle, SW update, PWA lifecycle
// Factory: createChromeStore(campId)
import { writable } from 'svelte/store';
import { LS } from '../db.js';

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
    LS.set('pwa_nudge_dismissed', true);
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
    if (LS.get('pwa_nudge_dismissed')) return () => {};
    let visits = LS.incrementVisitCount(campId);
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
      if (!LS.get('safari_warn_dismissed')) showSafariWarn.set(true);
    }
    if (isIOS && isSafari && !isStandalone) {
      if (!LS.get('ios_install_dismissed')) showIosInstall.set(true);
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
