# Workspace Playwright

> Ambiente de automação de testes multi-projeto construído com Playwright + TypeScript.

![Playwright](https://img.shields.io/badge/Playwright-1.61-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-26.x-339933?logo=node.js&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10.x-4B32C3?logo=eslint&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## Visão geral

Workspace centralizado para automação de testes Web e API com Playwright. Todos os projetos compartilham dependências, configuração, fixtures e utilitários a partir de uma raiz única — eliminando retrabalho e garantindo padronização.

Um único `playwright.config.ts` na raiz orquestra todos os projetos automaticamente nos três browsers (Chromium, Firefox, WebKit).

---

## Pré-requisitos

| Ferramenta | Versão mínima |
| ---------- | ------------- |
| Node.js    | 18.x          |
| npm        | 9.x           |
| Java (JDK) | 11+           |
| Git        | qualquer      |

---

## Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/dufelizardo/Workspace_Playwright.git
cd Workspace_Playwright

# 2. Instalar dependências
npm install

# 3. Instalar browsers
npx playwright install

# 4. Instalar Allure CLI (relatórios)
npm install -g allure-commandline

# 5. Configurar variáveis de ambiente
cp .env.example .env
```

Editar o `.env` com as URLs do projeto:

```env
BASE_URL=http://localhost:3000
API_URL=http://localhost:3000/api
```

---

## Estrutura

```
Workspace Playwright/
├── projects/
│   └── <nome-do-projeto>/
│       ├── tests/
│       │   ├── e2e/          ← specs de interface
│       │   └── api/          ← specs de API
│       ├── pages/            ← Page Objects do projeto
│       └── fixtures/         ← dados estáticos
├── shared/
│   ├── fixtures/
│   │   └── base.fixture.ts  ← test/expect extendidos (faker, uuid)
│   ├── helpers/
│   │   └── date.helper.ts
│   └── pages/
│       └── BasePage.ts      ← classe base para Page Objects
├── playwright.config.ts     ← orquestrador: todos os projetos × browsers
├── playwright.base.config.ts ← reporters, timeouts, uso compartilhado
├── tsconfig.json
├── eslint.config.cjs
└── .prettierrc
```

---

## Comandos

### Testes

```bash
# Toda a workspace (todos os projetos e browsers)
npm test

# Filtrar por projeto
npm run test:example

# Filtrar por browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Arquivo ou teste específico
npx playwright test projects/example/tests/e2e/meu-teste.spec.ts
npx playwright test -g "nome do teste"

# Modo visual interativo
npm run test:ui
```

### Relatórios

```bash
# HTML (Playwright nativo com Trace Viewer)
npm run report:show

# Allure
allure generate allure-results --clean -o allure-report
allure open allure-report
```

### Qualidade de código

```bash
npm run lint        # verificar
npm run lint:fix    # corrigir automaticamente
npm run format      # formatar com Prettier
```

---

## Fixtures compartilhadas

Todos os testes importam de `@fixtures/base.fixture` — nunca diretamente de `@playwright/test`:

```typescript
import { test, expect } from '@fixtures/base.fixture';

test('exemplo', async ({ page, faker, uuid }) => {
  const nome = faker.person.fullName();
  const id = uuid();
});
```

---

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

---

## Adicionar novo projeto

**1.** Criar a estrutura de pastas:

```bash
mkdir -p projects/<nome>/tests/e2e projects/<nome>/tests/api
mkdir -p projects/<nome>/pages projects/<nome>/fixtures
```

**2.** Registrar em `playwright.config.ts`:

```typescript
const TEST_PROJECTS = ['example', '<nome>'];
```

**3.** Adicionar script no `package.json`:

```json
"test:<nome>": "playwright test --project=\"<nome>:*\""
```

Pronto — o novo projeto herda automaticamente todos os browsers, reporters e fixtures.

---

## Path aliases

| Alias         | Resolve para        |
| ------------- | ------------------- |
| `@pages/*`    | `shared/pages/*`    |
| `@helpers/*`  | `shared/helpers/*`  |
| `@fixtures/*` | `shared/fixtures/*` |
| `@shared/*`   | `shared/*`          |

---

## Documentação

| Documento                              | Descrição                                      |
| -------------------------------------- | ---------------------------------------------- |
| [`WHITEPAPER.md`](WHITEPAPER.md)       | Arquitetura, decisões de design e estratégia   |
| [`REQUIREMENTS.md`](REQUIREMENTS.md)   | Pré-requisitos e guia de instalação detalhado  |
| [`requirements.txt`](requirements.txt) | Versões exatas de todas as dependências        |
| [`CLAUDE.md`](CLAUDE.md)               | Guia de referência rápida para desenvolvimento |

---

## Autor

**Eduardo Felizardo Cândido**
Senior QA Automation Engineer | AI-driven Testing | Robot
