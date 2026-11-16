const { test, expect } = require('@playwright/test');
const RegistrationPage = require('./page-objects/registration-page');

const invalidBorderColor = 'rgb(220, 53, 69)';
const validPassword = 'Password123';
const passwordError =
  'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter';

async function expectInvalid(locator) {
  await expect(locator).toHaveClass(/is-invalid/);
  await expect(locator).toHaveCSS('border-color', invalidBorderColor);
}

async function login(page, email, password) {
  await page.goto('/');
  await page.locator('.header_signin').click();
  await page.locator('#signinEmail').fill(email);
  await page.locator('#signinPassword').fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
}

test.describe('Registration form', () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await page.goto('/');
    await registrationPage.open();
  });

  test('should open Registration form with disabled Register button', async () => {
    await expect(registrationPage.title()).toBeVisible();
    await expect(registrationPage.registerButton()).toBeDisabled();
  });

  test('should validate Name field', async ({ page }) => {
    const nameInput = registrationPage.nameInput();

    await nameInput.focus();
    await nameInput.blur();
    await expect(page.getByText('Name required', { exact: true })).toBeVisible();
    await expectInvalid(nameInput);

    await nameInput.fill('John123');
    await nameInput.blur();
    await expect(page.getByText('Name is invalid', { exact: true })).toBeVisible();
    await expectInvalid(nameInput);

    await nameInput.fill('A');
    await nameInput.blur();
    await expect(page.getByText('Name has to be from 2 to 20 characters long')).toBeVisible();

    await nameInput.fill('A'.repeat(21));
    await nameInput.blur();
    await expect(page.getByText('Name has to be from 2 to 20 characters long')).toBeVisible();

    await nameInput.fill('Al');
    await nameInput.blur();
    await expect(nameInput).not.toHaveClass(/is-invalid/);

    await nameInput.fill('A'.repeat(20));
    await nameInput.blur();
    await expect(nameInput).not.toHaveClass(/is-invalid/);

    await nameInput.fill('  Alice  ');
    await nameInput.blur();
    await expect(page.getByText('Name is invalid', { exact: true })).toBeVisible();
    await expect(nameInput).toHaveValue('  Alice  ');
    await expectInvalid(nameInput);

    await nameInput.fill('    ');
    await nameInput.blur();
    await expect(page.getByText('Name is invalid', { exact: true })).toBeVisible();
    await expect(nameInput).toHaveValue('    ');
    await expectInvalid(nameInput);
    await expect(registrationPage.registerButton()).toBeDisabled();
  });

  test('should validate Last name field', async ({ page }) => {
    const lastNameInput = registrationPage.lastNameInput();

    await lastNameInput.focus();
    await lastNameInput.blur();
    await expect(page.getByText('Last name required', { exact: true })).toBeVisible();
    await expectInvalid(lastNameInput);

    await lastNameInput.fill('Taylor123');
    await lastNameInput.blur();
    await expect(page.getByText('Last name is invalid', { exact: true })).toBeVisible();
    await expect(lastNameInput).toHaveCSS('border-color', invalidBorderColor);

    await lastNameInput.fill('T');
    await lastNameInput.blur();
    await expect(page.getByText('Last name has to be from 2 to 20 characters long')).toBeVisible();

    await lastNameInput.fill('T'.repeat(21));
    await lastNameInput.blur();
    await expect(page.getByText('Last name has to be from 2 to 20 characters long')).toBeVisible();

    await lastNameInput.fill('Ta');
    await lastNameInput.blur();
    await expect(lastNameInput).not.toHaveClass(/is-invalid/);

    await lastNameInput.fill('T'.repeat(20));
    await lastNameInput.blur();
    await expect(lastNameInput).not.toHaveClass(/is-invalid/);

    await lastNameInput.fill('  Taylor  ');
    await lastNameInput.blur();
    await expect(page.getByText('Last name is invalid', { exact: true })).toBeVisible();
    await expect(lastNameInput).toHaveValue('  Taylor  ');

    await lastNameInput.fill('    ');
    await lastNameInput.blur();
    await expect(page.getByText('Last name is invalid', { exact: true })).toBeVisible();
    await expect(lastNameInput).toHaveValue('    ');
    await expectInvalid(lastNameInput);
    await expect(registrationPage.registerButton()).toBeDisabled();
  });

  test('should validate Email field', async ({ page }) => {
    const emailInput = registrationPage.emailInput();

    await emailInput.focus();
    await emailInput.blur();
    await expect(page.getByText('Email required', { exact: true })).toBeVisible();

    await emailInput.fill('invalid-email');
    await emailInput.blur();
    await expect(page.getByText('Email is incorrect', { exact: true })).toBeVisible();
    await expectInvalid(emailInput);

    await emailInput.fill('alice@example.com');
    await emailInput.blur();
    await expect(emailInput).not.toHaveClass(/is-invalid/);
  });

  test('should validate Password field', async ({ page }) => {
    const passwordInput = registrationPage.passwordInput();

    await passwordInput.focus();
    await passwordInput.blur();
    await expect(page.getByText('Password required', { exact: true })).toBeVisible();
    await expectInvalid(passwordInput);

    for (const password of ['Aa12345', 'password1', 'PASSWORD1', 'Password', 'Password123456789']) {
      await passwordInput.fill(password);
      await passwordInput.blur();
      await expect(page.getByText(passwordError, { exact: true })).toBeVisible();
      await expectInvalid(passwordInput);
    }

    for (const password of [validPassword, 'Aa123456', 'Aa1234567890123']) {
      await passwordInput.fill(password);
      await passwordInput.blur();
      await expect(passwordInput).not.toHaveClass(/is-invalid/);
    }
  });

  test('should validate Re-enter password field', async ({ page }) => {
    const repeatPasswordInput = registrationPage.repeatPasswordInput();

    await repeatPasswordInput.focus();
    await repeatPasswordInput.blur();
    await expect(page.getByText('Re-enter password required', { exact: true })).toBeVisible();
    await expectInvalid(repeatPasswordInput);

    await registrationPage.passwordInput().fill(validPassword);
    await repeatPasswordInput.fill('Password124');
    await repeatPasswordInput.blur();
    await expect(page.getByText('Passwords do not match', { exact: true })).toBeVisible();
    await expectInvalid(repeatPasswordInput);

    await repeatPasswordInput.fill(validPassword);
    await repeatPasswordInput.blur();
    await expect(repeatPasswordInput).not.toHaveClass(/is-invalid/);
  });

  test('should enable Register button only when form is valid', async () => {
    await registrationPage.nameInput().fill('Alice');
    await registrationPage.lastNameInput().fill('Taylor');
    await registrationPage.emailInput().fill('invalid-email');
    await registrationPage.passwordInput().fill(validPassword);
    await registrationPage.repeatPasswordInput().fill(validPassword);
    await expect(registrationPage.registerButton()).toBeDisabled();

    await registrationPage.emailInput().fill('alice@example.com');
    await registrationPage.emailInput().blur();
    await expect(registrationPage.registerButton()).toBeEnabled();

    await registrationPage.repeatPasswordInput().fill('Password124');
    await registrationPage.repeatPasswordInput().blur();
    await expect(registrationPage.registerButton()).toBeDisabled();
  });

  test('should register new user and allow login', async ({ page }) => {
    const email = `aqa.registration.${Date.now()}@example.com`;

    await registrationPage.nameInput().fill('Alice');
    await registrationPage.lastNameInput().fill('Taylor');
    await registrationPage.emailInput().fill(email);
    await registrationPage.passwordInput().fill(validPassword);
    await registrationPage.repeatPasswordInput().fill(validPassword);
    await expect(registrationPage.registerButton()).toBeEnabled();
    await registrationPage.registerButton().click();

    await expect(page.locator('.modal')).toHaveCount(0);
    await page.getByText('Log out', { exact: true }).click();
    await expect(page.locator('.header_signin')).toBeVisible();

    await login(page, email, validPassword);
    await expect(page).toHaveURL(/\/panel\/garage/);
  });
});
