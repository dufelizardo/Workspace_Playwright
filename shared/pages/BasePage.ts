import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path = ''): Promise<void> {
    await this.page.goto(path);
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}
