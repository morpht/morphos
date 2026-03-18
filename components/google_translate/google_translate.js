/*!
 * Project Name: Morphos (morpht/morphos)
 * File: components/google_translate/google_translate.js
 * Copyright (c) 2026 Morpht Pty Ltd
 */

/**
 * Google Translate component JavaScript.
 */

((Drupal, once) => {
  Drupal.behaviors.googleTranslate = {
    attach: (context) => {
      once('google_translate', '.google-translate', context).forEach(
        (wrapper) => {
          const element = wrapper.querySelector('.google-translate__element');
          if (!element) {
            return;
          }

          const language = wrapper.dataset.language || 'en';
          window.addEventListener('load', (event) => {
            new google.translate.TranslateElement(
              {
                pageLanguage: language,
              },
              element,
            );
          });
        },
      );
    },
  };
})(Drupal, once);
