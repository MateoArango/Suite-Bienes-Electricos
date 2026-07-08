import { test as base, expect, Page, APIRequestContext, request } from '@playwright/test';

const BASE_URL = 'https://bieneselectricosapi-qa.adacsc.co';

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

async function getAuthToken(apiContext: APIRequestContext): Promise<string> {
  const response = await apiContext.post(`${BASE_URL}/electrical-assets/auth/login`, {
    data: { login: 'qa', password: '123456' },
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
  }

  const body = await response.json();
  if (!body.success || !body.data?.token) {
    throw new Error(`Unexpected login response shape: ${JSON.stringify(body)}`);
  }

  return body.data.token;
}

type Fixtures = {
  page: Page;
  apiContext: APIRequestContext;
  authToken: string;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    page.on('load', () => disableAnimations(page));
    await use(page);
  },

  apiContext: async ({}, use) => {
    const context = await request.newContext({ baseURL: BASE_URL });
    await use(context);
    await context.dispose();
  },

  authToken: async ({ apiContext }, use) => {
    const token = await getAuthToken(apiContext);
    await use(token);
  },
});

export { expect };