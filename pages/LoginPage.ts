import { type Page, type Locator } from '@playwright/test';

export interface LoginFormOptions {
  tenant?: string;
  phone?: string;
  rememberMe?: boolean;
}

export interface LoginOtpOptions {
  tenant?: string;
  phone?: string;
  otp?: string;
  rememberMe?: boolean;
}

export class LoginPage {
  readonly page: Page;
  readonly logo: Locator;
  readonly heading: Locator;
  readonly leftSideText: Locator;
  readonly description: Locator;
  readonly tenantCodeLabel: Locator;
  readonly tenantCode: Locator;
  readonly phoneNumberLabel: Locator;
  readonly countryButton: Locator;
  readonly countrySearch: Locator;
  readonly phoneNumber: Locator;
  readonly rememberMe: Locator;
  readonly signInButton: Locator;
  readonly ssoButton: Locator;
  readonly footer: Locator;
  readonly invalidCredentials: Locator;
  readonly invalidPhone: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('svg.lucide-graduation-cap').first();
    this.heading = page.getByRole('heading', {
      name: 'Welcome LMSWorkforce360',
    });
    this.leftSideText = page.getByText('Enterprise Learning Management System');
    this.description = page.getByText(/Empower your team/i);
    this.tenantCodeLabel = page.getByText('Tenant code', { exact: true });
    this.tenantCode = page.getByPlaceholder('Enter tenant code');
    this.phoneNumberLabel = page.getByText('Phone number', { exact: true });
    this.countryButton = page.getByRole('button', { name: /^\+\d+$/ });
    this.countrySearch = page.getByRole('combobox');
    this.phoneNumber = page.getByPlaceholder('Enter phone number');
    this.rememberMe = page.getByRole('checkbox', { name: 'Remember Me' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.ssoButton = page.getByRole('button', { name: /Login With SSO|SSO/i });
    this.footer = page.getByText('© 2026 Enterprise LMS. All rights reserved.');
    this.invalidCredentials = page.getByText('Invalid Credentials');
    this.invalidPhone = page.getByText('phone must be a valid phone number');
  }

  async goto() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    await this.heading.waitFor();
  }

  async selectCountry(searchText: string, optionName: string | RegExp) {
    await this.countryButton.click();
    await this.countrySearch.fill(searchText);
    await this.page.getByRole('option', { name: optionName }).click();
  }

  async fillForm({
    tenant = '',
    phone = '',
    rememberMe = false,
  }: LoginFormOptions = {}) {
    await this.tenantCode.fill(tenant);
    await this.phoneNumber.fill(phone);
    if (rememberMe !== (await this.rememberMe.isChecked())) {
      await this.rememberMe.click();
    }
  }

  async submit() {
    return Promise.all([
      this.page.waitForResponse((response) =>
        response.url().includes('/auth/otp/send')
      ),
      this.signInButton.click(),
    ]).then(([response]) => response);
  }

  async clickLoginWithSso() {
    await this.ssoButton.click();
    await this.page.waitForURL(/dev-workspring-sso\.aixhub\.ai/);
  }

  async loginWithOtp({
    tenant = '',
    phone = '',
    otp = '560025',
    rememberMe = true,
  }: LoginOtpOptions = {}) {
    await this.goto();
    await this.selectCountry('India', /India \+91/);
    await this.fillForm({ tenant, phone, rememberMe });
    await this.submit();

    const otpInput = this.page.getByPlaceholder('Enter OTP');
    if (await otpInput.count()) {
      await otpInput.waitFor({ state: 'visible' });
      await otpInput.fill(otp);
    } else {
      const otpInputs = this.page
        .getByRole('heading', { name: 'Verify using phone number' })
        .locator('..')
        .getByRole('textbox');

      await otpInputs.first().waitFor({ state: 'visible' });
      for (const [index, digit] of otp.split('').entries()) {
        await otpInputs.nth(index).fill(digit);
      }
    }

    await this.page.getByRole('button', { name: /Verify & Continue/i }).click();
    await this.page.waitForURL(/\/dashboard/);
  }
}
