class LoginPage {
  constructor(page) {
    this.page = page;
  }

  signInButton() {
    return this.page.locator('.header_signin');
  }

  emailInput() {
    return this.page.locator('#signinEmail');
  }

  passwordInput() {
    return this.page.locator('#signinPassword');
  }

  loginButton() {
    return this.page.getByRole('button', { name: 'Login', exact: true });
  }

  logoutButton() {
    return this.page.getByText('Log out', { exact: true });
  }

  async login(email, password) {
    await this.page.goto('/');
    await this.signInButton().click();
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async logout() {
    await this.logoutButton().click();
  }
}

module.exports = LoginPage;
