# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Autor:** Eduardo Felizardo Cândido — Senior QA Automation Engineer | AI-driven Testing | Robot

## Comandos essenciais

```bash
# Rodar toda a workspace (todos os projetos, todos os browsers)
npm test

# Filtrar por projeto
npm run test:example

# Filtrar por browser (todos os projetos)
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Rodar um único arquivo de spec
npx playwright test projects/example/tests/e2e/meu-teste.spec.ts

# Rodar um único teste por nome
npx playwright test -g "nome do teste"

# Modo UI interativo (depuração visual)
npm run test:ui

# Lint e format
npm run lint:fix
npm run format

# Relatório HTML (após rodar os testes)
npm run report:show

# Relatório Allure
allure generate allure-results --clean -o allure-report && allure open allure-report
```

## Arquitetura

Workspace multi-projeto **não independente** — um único `playwright.config.ts` na raiz orquestra todos os projetos. Adicionar um projeto é registrá-lo em `TEST_PROJECTS` no config raiz.

```
playwright.config.ts          ← orquestrador: itera TEST_PROJECTS × BROWSERS
        ↑ estende
playwright.base.config.ts     ← timeout, expect.timeout, reporters, use (screenshot/video/trace)

projects/<nome>/tests/        ← specs do projeto
projects/<nome>/pages/        ← Page Objects específicos
shared/pages/BasePage.ts      ← classe base para todos os Page Objects
shared/helpers/               ← utilitários (date.helper.ts, etc.)
shared/fixtures/base.fixture.ts  ← test e expect extendidos com faker e uuid
```

Os reporters (HTML + Allure + List) são configurados no `baseConfig` e saem sempre na raiz:

- `playwright-report/` — HTML com Trace Viewer
- `allure-results/` — dados brutos do Allure

## Nomes dos projetos Playwright

O config gera nomes no formato `<projeto>:<browser>` (ex: `example:chromium`). Isso permite filtros por eixo:

```bash
npx playwright test --project="example:*"    # um projeto, todos os browsers
npx playwright test --project="*:chromium"   # todos os projetos, um browser
```

## Fixtures compartilhadas

Todos os testes importam de `@fixtures/base.fixture` — nunca de `@playwright/test` diretamente:

```typescript
import { test, expect } from '@fixtures/base.fixture';

test('exemplo', async ({ page, faker, uuid }) => {
  const nome = faker.person.fullName();
  const id = uuid();
});
```

Fixtures disponíveis: `faker` (`@faker-js/faker`) e `uuid` (gera v4).

## Page Objects

Estendem `BasePage` de `@pages/BasePage`:

```typescript
import { BasePage } from '@pages/BasePage';

export class LoginPage extends BasePage {
  async login(user: string, pass: string) {
    await this.locator('#user').fill(user);
    await this.locator('#pass').fill(pass);
  }
}
```

`BasePage` expõe `navigate(path)` e `locator(selector)` como métodos protegidos.

## Path aliases

| Alias         | Resolve para        |
| ------------- | ------------------- |
| `@pages/*`    | `shared/pages/*`    |
| `@helpers/*`  | `shared/helpers/*`  |
| `@fixtures/*` | `shared/fixtures/*` |
| `@shared/*`   | `shared/*`          |

## Adicionar novo projeto

1. Criar pastas: `projects/<nome>/tests/e2e`, `tests/api`, `pages`, `fixtures`
2. Registrar em `playwright.config.ts`:

```typescript
const TEST_PROJECTS = ['example', '<nome>'];
```

3. Adicionar scripts de filtro no `package.json`:

```json
"test:<nome>": "playwright test --project=\"<nome>:*\""
```

## Variáveis de ambiente

Lidas do `.env` na raiz (não versionado). Template em `.env.example`:

- `BASE_URL` — `baseURL` padrão em todos os projetos
- `API_URL` — para chamadas de API direta nos testes

## ESLint

`eslint.config.cjs` (flat config, CommonJS). O próprio arquivo está no `ignores` para evitar conflito com `require()`. Regra relevante: `no-unused-vars` aceita variáveis prefixadas com `_`.
