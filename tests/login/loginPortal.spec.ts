import { test, expect } from './fixtures';

test.describe('Login Portal Tests', () => {
  // Shared Test Data
  const baseUrl = 'https://bieneselectricos-qa.adacsc.co/';
  const validUsername = 'qa';
  const validPassword = '123456';
  const invalidUsername = 'invalid_user_123';
  const invalidPassword = '123';

  // Navigate to the login page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    // Verify the login page has loaded
    await expect(page.getByRole('heading', { name: 'Bienvenido al sistema Sicof' })).toBeVisible();

    // Fill in the username
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill(validUsername);

    // Submit the username
    await page.getByTestId('loginSubmitButton').click();

    // Fill in the password
    await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(validPassword);
    await expect(page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña')).toBeVisible();

    // Submit the password
    await page.getByTestId('loginSubmitButton').click();

    // Verify successful login navigation to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // Fill in the username
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill(validUsername);

    // Submit the username
    await page.getByTestId('loginSubmitButton').click();

    // Fill in the password
    await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(invalidPassword);

    // Submit the password
    await page.getByTestId('loginSubmitButton').click();

    // Verify error message
    await expect(page.getByText('Error de autenticación. Por')).toBeVisible();
  });

  test('should disable login button when username field is empty', async ({ page }) => {
    // Submit without filling the username and verify button is disabled
    await expect(page.getByTestId('loginSubmitButton')).toBeDisabled();
  });

  test('should disable login button when password field is empty', async ({ page }) => {
    // Fill in the username and submit
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill(validUsername);
    await page.getByTestId('loginSubmitButton').click();

    // Submit without filling the password and verify button is disabled
    await expect(page.getByTestId('loginSubmitButton')).toBeDisabled();
  });

  test('should show error on invalid username', async ({ page }) => {
    // Fill in an invalid username
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill(invalidUsername);
    await page.getByTestId('loginSubmitButton').click();

    // Fill in the password
    await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(validPassword);
    await page.getByTestId('loginSubmitButton').click();

    // Verify error message
    await expect(page.getByText('Error de autenticación. Por')).toBeVisible();
  });
});