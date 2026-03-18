/*!
 * Project Name: Morphos (morpht/morphos)
 * File: components/slider/slider.js
 * Copyright (c) 2026 Morpht Pty Ltd
 */

((Drupal, once) => {
  const isCanvasEditor = () => {
    try {
      return (
        !!window?.parent?.drupalSettings?.canvas &&
        !window.parent.document.body.querySelector(
          '[class^=_PagePreviewIframe]',
        )
      );
    } catch (e) {
      return false;
    }
  };

  /**
   * Build responsive breakpoints from the base config.
   *
   * Mobile (< 768px): 1 slide, 1 row.
   * Tablet (768px): half of desktop slidesPerView (min 1).
   * Desktop (1024px): full slidesPerView and grid rows.
   */
  const buildBreakpoints = (config) => {
    const desktopPerView = config.slidesPerView || 1;
    const desktopPerGroup = config.slidesPerGroup || 1;
    const desktopSpaceBetween = config.spaceBetween || 0;
    const hasGrid = config.grid && config.grid.rows > 1;

    if (desktopPerView <= 1 && !hasGrid) return {};

    const tabletPerView = Math.max(1, Math.ceil(desktopPerView / 2));
    const tabletPerGroup = Math.min(desktopPerGroup, tabletPerView);

    const breakpoints = {
      768: {
        slidesPerView: tabletPerView,
        slidesPerGroup: tabletPerGroup,
        spaceBetween: desktopSpaceBetween,
      },
      1024: {
        slidesPerView: desktopPerView,
        slidesPerGroup: desktopPerGroup,
        spaceBetween: desktopSpaceBetween,
      },
    };

    if (hasGrid) {
      breakpoints[768].grid = {
        rows: Math.max(1, Math.ceil(config.grid.rows / 2)),
        fill: config.grid.fill || 'column',
      };
      breakpoints[1024].grid = config.grid;
    }

    return breakpoints;
  };

  /**
   * Wait for all images inside an element to finish loading.
   */
  const waitForImages = (el) => {
    const images = el.querySelectorAll('img');
    const promises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }
        }),
    );
    return Promise.all(promises);
  };

  /**
   * Measure the tallest slide's natural height and set the container
   * height so Swiper grid can calculate row percentages.
   *
   * @param {HTMLElement} el - The Swiper container.
   * @param {number} rows - Number of grid rows.
   * @param {number} spaceBetween - Gap between rows in pixels.
   */
  const applyGridHeight = (el, rows, spaceBetween) => {
    if (rows <= 1) return;

    const slides = el.querySelectorAll('.swiper-slide');
    let maxHeight = 0;

    slides.forEach((slide) => {
      // Temporarily reset any Swiper-set height to get natural height.
      const prev = slide.style.height;
      slide.style.height = 'auto';
      maxHeight = Math.max(maxHeight, slide.offsetHeight);
      slide.style.height = prev;
    });

    if (maxHeight > 0) {
      el.style.height = maxHeight * rows + spaceBetween * (rows - 1) + 'px';
    }
  };

  Drupal.behaviors.swiperSlider = {
    attach: (context) => {
      if (isCanvasEditor()) return;

      once('swiper-init', '.slider', context).forEach((el) => {
        const wrapper = el.querySelector('.swiper-wrapper');
        if (wrapper) {
          Array.from(wrapper.children).forEach((child) => {
            child.classList.add('swiper-slide');
          });
        }

        let config = {};
        try {
          config = JSON.parse(el.getAttribute('data-swiper-config'));
        } catch (e) {
          Drupal.throwError(e);
        }

        // Vertical mode: set container height to tallest slide.
        if (config.direction === 'vertical' && wrapper) {
          let maxHeight = 0;
          Array.from(wrapper.children).forEach((slide) => {
            maxHeight = Math.max(maxHeight, slide.offsetHeight);
          });
          if (maxHeight > 0) {
            el.style.height = maxHeight + 'px';
          }
        }

        // Grid mode: set container height BEFORE Swiper init so
        // percentage-based row heights have a reference value.
        const gridRows = config.grid ? config.grid.rows : 1;
        if (gridRows > 1) {
          applyGridHeight(el, gridRows, config.spaceBetween || 0);
        }

        // Build responsive breakpoints.
        const breakpoints = buildBreakpoints(config);
        const hasBreakpoints = Object.keys(breakpoints).length > 0;

        const swiperOptions = {
          ...config,
          // When using breakpoints, set mobile-first base values.
          ...(hasBreakpoints
            ? {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: config.spaceBetween || 0,
                ...(config.grid
                  ? { grid: { rows: 1, fill: config.grid.fill || 'column' } }
                  : {}),
                breakpoints,
              }
            : {}),
          pagination: config.pagination
            ? {
                el: el.querySelector('.swiper-pagination'),
                type: config.pagination.type || 'bullets',
                clickable: true,
              }
            : false,
          navigation: config.navigation
            ? {
                nextEl: el.querySelector('.swiper-button-next'),
                prevEl: el.querySelector('.swiper-button-prev'),
              }
            : false,
          scrollbar: {
            el: el.querySelector('.swiper-scrollbar'),
          },
        };

        const swiper = new Swiper(el, swiperOptions);
        el._swiperInstance = swiper;

        // Grid mode: recalculate height after images load, then on resize.
        if (gridRows > 1) {
          waitForImages(el).then(() => {
            applyGridHeight(el, gridRows, config.spaceBetween || 0);
            swiper.update();
          });

          const ro = new ResizeObserver(() => {
            applyGridHeight(el, gridRows, config.spaceBetween || 0);
            swiper.update();
          });
          ro.observe(el);
          el._swiperGridRo = ro;
        }
      });
    },

    detach: (context) => {
      once.remove('swiper-init', '.slider', context).forEach((el) => {
        if (el._swiperGridRo) {
          el._swiperGridRo.disconnect();
          delete el._swiperGridRo;
        }
        if (el._swiperInstance) {
          el._swiperInstance.destroy(true, true);
          delete el._swiperInstance;
        }
      });
    },
  };
})(Drupal, once);
