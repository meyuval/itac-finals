import type { Locator, Page } from '@playwright/test';

/** The sign-in page at `/login`. Form fields are labelled only by placeholder, hence role + name locators. */
export class LoginPage {
  readonly heading: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly termsCheckbox: Locator;
  readonly signInButton: Locator;
  readonly termsOfServiceLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1, name: 'Sign in' });
    this.emailField = page.getByRole('textbox', { name: 'Email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.termsCheckbox = page.getByRole('checkbox', { name: /I agree to the Evaluation Terms/ });
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.termsOfServiceLink = page.getByRole('link', { name: 'Terms of Service' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
  }

  async acceptTerms(): Promise<void> {
    await this.termsCheckbox.click();
  }

  /** Full sign-in: fills the form, accepts the terms and submits. Does not assert the landing page. */
  async signIn(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.acceptTerms();
    await this.signInButton.click();
  }

  errorMessage(text: string): Locator {
    return this.page.getByText(text);
  }
}
