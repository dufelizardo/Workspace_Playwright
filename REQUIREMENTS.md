# Workspace Playwright — Requirements

**Autor:** Eduardo Felizardo Cândido — Senior QA Automation Engineer | AI-driven Testing | Robot
**Data:** 2026-07-09

## Pré-requisitos do sistema

| Ferramenta | Versão mínima | Verificar       |
| ---------- | ------------- | --------------- |
| Node.js    | v18.x         | `node -v`       |
| npm        | 9.x           | `npm -v`        |
| Java (JDK) | 11+           | `java -version` |
| Git        | qualquer      | `git --version` |

> **Ambiente utilizado:** Node v26.4.0 · npm 11.17.0 · OpenJDK 23.0.2 (Eclipse Temurin)

---

## Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositório>
cd "Workspace Playwright"
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Instalar browsers do Playwright

```bash
npx playwright install
```

### 4. Instalar Allure CLI (necessário para relatórios Allure)

```bash
npm install -g allure-commandline
```

### 5. Configurar variáveis de ambiente

Copiar o arquivo de exemplo e preencher:

```bash
cp .env.example .env
```

| Variável   | Descrição                 | Exemplo                     |
| ---------- | ------------------------- | --------------------------- |
| `BASE_URL` | URL base da aplicação web | `http://localhost:3000`     |
| `API_URL`  | URL base da API           | `http://localhost:3000/api` |

---

## Estrutura do workspace

```
Workspace Playwright/
├── projects/                      # Um diretório por projeto
│   └── <nome-do-projeto>/
│       ├── tests/
│       │   ├── e2e/               # Specs de interface
│       │   └── api/               # Specs de API
│       ├── pages/                 # Page Objects do projeto
│       ├── fixtures/              # Dados estáticos do projeto
│       └── playwright.config.ts   # Config do projeto (estende a base)
├── shared/                        # Código reutilizado por todos os projetos
│   ├── helpers/                   # Utilitários (data, string, etc.)
│   └── pages/                     # Page Objects compartilhados
├── playwright.base.config.ts      # Configuração base (reporters, browsers, use)
├── package.json
├── tsconfig.json
├── eslint.config.cjs
├── .prettierrc
└── .env
```

---

## Scripts disponíveis

### Testes — projeto `example`

```bash
npm run test:example              # Todos os browsers (Chromium, Firefox, WebKit)
npm run test:example:chromium     # Apenas Chromium
npm run test:example:headed       # Com janela do browser visível
npm run test:example:ui           # Modo UI interativo do Playwright
```

### Relatórios

```bash
npm run report:show               # Abre o relatório HTML do Playwright
npm run report:allure             # Serve o relatório Allure no browser
```

Gerar relatório Allure após os testes:

```bash
allure generate allure-results --clean -o allure-report
allure open allure-report
```

### Qualidade de código

```bash
npm run lint                      # Verifica erros de lint
npm run lint:fix                  # Corrige automaticamente
npm run format                    # Formata com Prettier
```

---

## Adicionar um novo projeto

1. Criar a estrutura de pastas:

```bash
mkdir -p projects/<nome>/tests/e2e projects/<nome>/tests/api projects/<nome>/pages projects/<nome>/fixtures
```

2. Criar `projects/<nome>/playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';
import { baseConfig } from '../../playwright.base.config';

export default defineConfig({
  ...baseConfig,
  testDir: './tests',
});
```

3. Adicionar os scripts no `package.json` raiz:

```json
"test:<nome>": "playwright test --config=projects/<nome>/playwright.config.ts",
"test:<nome>:ui": "playwright test --config=projects/<nome>/playwright.config.ts --ui"
```

---

## Path aliases (tsconfig)

| Alias        | Resolve para       |
| ------------ | ------------------ |
| `@shared/*`  | `shared/*`         |
| `@pages/*`   | `shared/pages/*`   |
| `@helpers/*` | `shared/helpers/*` |

---

## Hooks de qualidade (Husky)

O hook `pre-commit` executa `lint-staged` automaticamente a cada commit:

- Arquivos `.ts` → ESLint fix + Prettier
- Arquivos `.json` e `.md` → Prettier
