# Morphos Theme

Morphos is a component-based Drupal theme, providing a modern and flexible starting point for site owners to build scalable and efficient websites using [Drupal Canvas](/project/canvas).

## Getting started

To use Morphos, you can install it via Composer, like any other Drupal theme. But Morphos is designed to be copied, rather than used as a contributed theme or base theme, and you should not assume that future updates will be compatible with your site.

To create the clone to use for your site, use Drupal core's starter kit tool:

```shell
cd drupal/web
php core/scripts/drupal generate-theme my_theme --name="My Custom Theme" --description="A customized version of Morphos." --starterkit=morphos
```

This will create a copy of Morphos called `my_theme`, and place it in `themes/my_theme`. This theme is yours, and you can customize it in any way you see fit!

To install it in Drupal, either visit the `/admin/appearance` page, or run `drush theme:enable my_theme` at the command line.

You can then remove the contributed version via Composer with `composer remove drupal/morphos`.

### Sub-theming

**Don't create your custom theme as a sub-theme of Morphos.** Morphos is meant to be used as a starter kit, and does not provide backward compatibility. This allows us to rapidly innovate, iterate, and improve. If you create a sub-theme of Morphos, it is likely to break in the future.

## Customizing

### Fonts & colors

To change the fonts or colors in `my_theme`, edit the `theme.css` file. Changes to `theme.css` do not require a CSS rebuild, but you may need to clear the cache.

### Custom components

Morphos uses [single-directory components](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components) and comes with a variety of commonly used components. You can add new components and modify existing ones, but be sure to rebuild the CSS when you make changes.

## Building CSS

Morphos uses [Tailwind](https://tailwindcss.com) to simplify styling by using classes to compose designs directly in the markup.

If you want to customize the Tailwind-generated CSS, install the development tooling dependencies by running the following command in your theme's directory:

```shell
npm install
```

If you modify CSS files or classes in a Twig template, you need to rebuild the CSS:

```bash
npm run build
```

For development, you can watch for changes and automatically rebuild the CSS:

```bash
npm run dev
```

## Code Formatting

Morphos uses [Prettier](https://prettier.io) to automatically format code for consistency. The project is configured with plugins for Tailwind CSS and Twig templates.

For the best experience, [set up Prettier in your editor](https://prettier.io/docs/editors) to automatically format files on save.

To format all files in the project:

```bash
npm run format
```

To check if files are formatted correctly without making changes:

```bash
npm run format:check
```

**Note**: Some files are excluded from formatting via `.prettierignore`, such as Drupal's `html.html.twig` template, which contains placeholder tokens that break Prettier's HTML parsing.

## Known issues

Canvas's code components are currently not compatible with Tailwind-based themes like Morphos, and creating a code component will break Morphos's styling. This will be fixed in [#3549628], but for now, here's how to work around it:

1. In Canvas's in-browser code editor, open the Global CSS tab.
2. Paste the contents of your custom theme's `theme.css` into the code editor. It must be at the top.
3. Paste the contents of your custom theme's `main.css` into the code editor, removing all the `@import` statements at the top first. It must come _after_ the contents of `theme.css`.
4. Save the global CSS.

## Getting help

If you have trouble or questions, please [visit the issue queue](https://www.drupal.org/project/issues/morphos?categories=All) or find us on [Drupal Slack](https://www.drupal.org/community/contributor-guide/reference-information/talk/tools/slack), in the `#drupal-cms-support` channel.

## Roadmap

Morphos is under active development. Planned improvements include more components, better customization options, and [Storybook support](https://www.drupal.org/project/morphos/issues/3562711). If you want to contribute to Morphos, check out the `#drupal-cms-development` channel in Drupal Slack.
