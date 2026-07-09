import { test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';

type SharedFixtures = {
  faker: typeof faker;
  uuid: () => string;
};

export const test = base.extend<SharedFixtures>({
  faker: async (_fixtures, use) => {
    await use(faker);
  },
  uuid: async (_fixtures, use) => {
    await use(uuid);
  },
});

export { expect } from '@playwright/test';
