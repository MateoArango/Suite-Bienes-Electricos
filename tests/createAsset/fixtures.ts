import { test as base, expect, Page } from '@playwright/test';

/**
 * Injects a <style> tag that kills ALL CSS transitions and animations.
 * This is the reliable way to fix "element is not stable" errors caused
 * by Angular Material animation classes (mat-ripple, mat-calendar, overlays, etc.)
 */
async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        transition-duration: 0ms !important;
        transition-delay:    0ms !important;
        animation-duration:  0ms !important;
        animation-delay:     0ms !important;
      }
    `,
  });
}

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    // Re-inject on every full page load (covers SPA navigations too)
    page.on('load', () => disableAnimations(page));
    await use(page);
  },
});

export { expect };