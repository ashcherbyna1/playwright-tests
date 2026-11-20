class RegistrationPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.locator('.hero-descriptor_btn').click();
  }

  title() {
    return this.page.getByRole('heading', { name: 'Registration', exact: true });
  }

  nameInput() {
    return this.page.locator('#signupName');
  }

  lastNameInput() {
    return this.page.locator('#signupLastName');
  }

  emailInput() {
    return this.page.locator('#signupEmail');
  }

  passwordInput() {
    return this.page.locator('#signupPassword');
  }

  repeatPasswordInput() {
    return this.page.locator('#signupRepeatPassword');
  }

  registerButton() {
    return this.page.getByRole('button', { name: 'Register', exact: true });
  }

  errorMessage(message) {
    return this.page.getByText(message, { exact: true });
  }

  modal() {
    return this.page.locator('.modal');
  }

  async fillForm({ name, lastName, email, password, repeatPassword }) {
    await this.nameInput().fill(name);
    await this.lastNameInput().fill(lastName);
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.repeatPasswordInput().fill(repeatPassword);
  }
}

module.exports = RegistrationPage;
