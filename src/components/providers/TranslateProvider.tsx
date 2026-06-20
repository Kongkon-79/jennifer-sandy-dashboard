/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { parseCookies, setCookie } from 'nookies';

type TranslationConfig = {
  sourceLanguage: string;
  defaultLanguage: string;
  languages: { name: string; title: string }[];
};

declare global {
  interface Window {
    TranslateInit?: () => void;
    __GOOGLE_TRANSLATION_CONFIG__?: TranslationConfig;
    __GOOGLE_TRANSLATION_DOM_PATCHED__?: boolean;
    google?: any;
  }
}

const COOKIE_NAME = 'googtrans';
const SCRIPT_ID = 'google-translate-script';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const translationConfig: TranslationConfig = {
  sourceLanguage: 'en',
  defaultLanguage: 'de',
  languages: [
    { title: 'Deutsch', name: 'de' },
    { title: 'English', name: 'en' },
  ],
};

function ensureDefaultLanguageCookie() {
  const currentCookie = parseCookies()[COOKIE_NAME];

  if (currentCookie) {
    return;
  }

  setCookie(
    undefined,
    COOKIE_NAME,
    `/${translationConfig.sourceLanguage}/${translationConfig.defaultLanguage}`,
    {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    },
  );
}

function patchGoogleTranslateDomConflicts() {
  if (window.__GOOGLE_TRANSLATION_DOM_PATCHED__) {
    return;
  }

  window.__GOOGLE_TRANSLATION_DOM_PATCHED__ = true;

  const originalRemoveChild = Node.prototype.removeChild;
  const originalInsertBefore = Node.prototype.insertBefore;

  Node.prototype.removeChild = function removeChild<T extends Node>(child: T) {
    if (child.parentNode !== this) {
      return child;
    }

    return originalRemoveChild.call(this, child) as T;
  };

  Node.prototype.insertBefore = function insertBefore<T extends Node>(
    newNode: T,
    referenceNode: Node | null,
  ) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return originalInsertBefore.call(this, newNode, null) as T;
    }

    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

function dispatchConfigReady() {
  window.dispatchEvent(new Event('translationConfigReady'));
}

function initTranslate() {
  const el = document.getElementById('google_translate_element');

  if (!el || !window.google?.translate?.TranslateElement) {
    return;
  }

  el.innerHTML = '';

  new window.google.translate.TranslateElement(
    {
      pageLanguage: translationConfig.sourceLanguage,
      includedLanguages: translationConfig.languages
        .map(language => language.name)
        .join(','),
      autoDisplay: false,
    },
    'google_translate_element',
  );
}

function loadGoogleTranslateScript() {
  if (document.getElementById(SCRIPT_ID)) {
    initTranslate();
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src =
    'https://translate.google.com/translate_a/element.js?cb=TranslateInit';
  script.async = true;
  document.body.appendChild(script);
}

export default function TranslateProvider() {
  useEffect(() => {
    window.__GOOGLE_TRANSLATION_CONFIG__ = translationConfig;
    window.TranslateInit = initTranslate;

    patchGoogleTranslateDomConflicts();
    ensureDefaultLanguageCookie();
    dispatchConfigReady();
    loadGoogleTranslateScript();
  }, []);

  return <div id="google_translate_element" aria-hidden="true" />;
}
