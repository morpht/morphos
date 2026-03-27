<?php

/**
 * @file
 * Theme settings form.
 *
 * @see morphos_theme_settings_alter()
 */

use Drupal\Core\Form\FormStateInterface;

require_once dirname(__DIR__, 1) . '/theme_colors/theme_colors.inc';
require_once dirname(__DIR__, 1) . '/includes/licence.inc';

/**
 * Attach theme settings form.
 */
function _morphos_theme_settings(&$form, FormStateInterface $form_state): void {
  // Warn if sub-theme acknowledgement has not been accepted.
  $themeSettingsProvider = \Drupal::service('Drupal\Core\Extension\ThemeSettingsProvider');
  $subtheme_acknowledged = $themeSettingsProvider->getSetting('definition.subtheme_acknowledgement');
  $input = $form_state->getUserInput();
  if (empty($input['definition']['subtheme_acknowledgement']) && !$subtheme_acknowledged) {
    \Drupal::messenger()->addWarning(t('Morphos is currently set as the active theme. It is recommended to clone Morphos and use the cloned theme instead. <a href="@url" target="_blank">See the documentation</a> for more information.', [
      '@url' => 'https://docs.morpht.com/convivial-gov',
    ]));
  }

  // Create a section for theme settings.
  $form['morphos_settings'] = [
    '#type' => 'horizontal_tabs',
    '#title' => t('Theme settings'),
    '#description' => t('Configure options'),
    '#weight' => -100,
    '#open' => TRUE,
  ];

  // Theme colors settings.
  _theme_colors($form, $form_state);

  // Licence settings.
  _theme_licence($form, $form_state);
}
