import { test, expect } from '../fixtures';
import { testMetadata } from '../helpers/testMetadata';

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

  test('should successfully log in with valid credentials', testMetadata('QA-AUTH-001', 'Authenticates a valid user and redirects the session to the dashboard.'), async ({ page }) => {
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

  test('should show error on invalid credentials', testMetadata('QA-AUTH-002', 'Rejects a valid username paired with an invalid password and displays the authentication error.'), async ({ page }) => {
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

  test('should disable login button when username field is empty', testMetadata('QA-AUTH-003', 'Keeps the login action disabled until a username is provided.'), async ({ page }) => {
    // Submit without filling the username and verify button is disabled
    await expect(page.getByTestId('loginSubmitButton')).toBeDisabled();
  });

  test('should disable login button when password field is empty', testMetadata('QA-AUTH-004', 'Keeps the login action disabled on the password step until a password is provided.'), async ({ page }) => {
    // Fill in the username and submit
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill(validUsername);
    await page.getByTestId('loginSubmitButton').click();

    // Submit without filling the password and verify button is disabled
    await expect(page.getByTestId('loginSubmitButton')).toBeDisabled();
  });

  test('should show error on invalid username', testMetadata('QA-AUTH-005', 'Rejects an unknown username even when it is paired with the valid test password.'), async ({ page }) => {
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
