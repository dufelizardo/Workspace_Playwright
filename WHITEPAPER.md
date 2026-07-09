# Whitepaper — Workspace Playwright

**Versão:** 1.0.0
**Data:** 2026-07-09
**Classificação:** Interno
**Autor:** Eduardo Felizardo Cândido — Senior QA Automation Engineer | AI-driven Testing | Robot

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Problema e Motivação](#2-problema-e-motivação)
3. [Arquitetura do Workspace](#3-arquitetura-do-workspace)
4. [Stack Tecnológica](#4-stack-tecnológica)
5. [Decisões de Design](#5-decisões-de-design)
6. [Qualidade de Código](#6-qualidade-de-código)
7. [Estratégia de Relatórios](#7-estratégia-de-relatórios)
8. [Escalabilidade Multi-Projeto](#8-escalabilidade-multi-projeto)
9. [Integração com CI/CD](#9-integração-com-cicd)
10. [Conclusão](#10-conclusão)

---

## 1. Visão Geral

Este documento descreve a arquitetura, as decisões técnicas e as práticas adotadas no **Workspace Playwright** — um ambiente de automação de testes de software construído sobre o framework Playwright, com suporte a múltiplos projetos, qualidade de código automatizada e relatórios profissionais.

O workspace foi projetado para ser a base de trabalho de equipes de Quality Engineering que precisam de uma estrutura confiável, padronizada e escalável para automação de testes Web e de API.

---

## 2. Problema e Motivação

### 2.1 Contexto

Equipes de QA frequentemente enfrentam os seguintes desafios ao estruturar ambientes de automação:

- **Fragmentação:** cada projeto cria sua própria estrutura sem padrão, dificultando a colaboração e a manutenção.
- **Retrabalho:** helpers, Page Objects e utilitários são reescritos em cada projeto.
- **Ausência de gates de qualidade:** código sem lint ou formatação padronizada acumula dívida técnica.
- **Relatórios inconsistentes:** ausência de uma estratégia unificada de evidências dificulta a rastreabilidade.
- **Onboarding lento:** novos membros levam tempo para entender estruturas diferentes em cada projeto.

### 2.2 Solução Proposta

Um workspace único com:

- Raiz compartilhada de dependências e configurações.
- Projetos isolados em subdiretórios com configuração mínima.
- Código compartilhado (helpers, Page Objects base) disponível via path aliases.
- Qualidade de código garantida por hooks automatizados.
- Relatórios padronizados gerados após cada execução.

---

## 3. Arquitetura do Workspace

### 3.1 Estrutura de Diretórios

```
Workspace Playwright/
├── projects/                        # Projetos de automação
│   └── <nome-do-projeto>/
│       ├── tests/
│       │   ├── e2e/                 # Specs de interface (*.spec.ts)
│       │   └── api/                 # Specs de API (*.spec.ts)
│       ├── pages/                   # Page Objects específicos do projeto
│       ├── fixtures/                # Dados estáticos do projeto
│       └── playwright.config.ts     # Configuração que estende a base
│
├── shared/                          # Código reutilizado por todos os projetos
│   ├── helpers/                     # Utilitários (data, string, uuid, etc.)
│   └── pages/                       # Page Objects compartilhados (BasePage)
│
├── playwright.base.config.ts        # Configuração central (reporters, browsers, use)
├── package.json                     # Dependências únicas para toda a workspace
├── tsconfig.json                    # Compilador TypeScript + path aliases
├── eslint.config.cjs                # Regras de lint (flat config)
├── .prettierrc                      # Formatação de código
├── .env                             # Variáveis de ambiente (não versionado)
├── .env.example                     # Template de variáveis de ambiente
├── .husky/pre-commit                # Hook: lint-staged antes de cada commit
├── REQUIREMENTS.md                  # Pré-requisitos do sistema
├── requirements.txt                 # Versões exatas de todas as dependências
└── WHITEPAPER.md                    # Este documento
```

### 3.2 Fluxo de Dependência

```
playwright.base.config.ts
        ↑
projects/<nome>/playwright.config.ts   (estende a base via spread)
        ↑
tests/*.spec.ts                        (importa de shared/ via path aliases)
        ↑
shared/pages/   shared/helpers/        (código reutilizável)
```

Cada projeto adiciona apenas o que é específico ao seu contexto — o restante vem da camada compartilhada.

---

## 4. Stack Tecnológica

### 4.1 Core

| Tecnologia     | Versão | Papel                             |
| -------------- | ------ | --------------------------------- |
| **Playwright** | 1.61.1 | Motor de automação (Web + API)    |
| **TypeScript** | 6.x    | Tipagem estática e autocompletion |
| **Node.js**    | 26.x   | Runtime                           |

### 4.2 Qualidade de Código

| Tecnologia            | Versão | Papel                                    |
| --------------------- | ------ | ---------------------------------------- |
| **ESLint**            | 10.x   | Análise estática e regras de qualidade   |
| **typescript-eslint** | 8.x    | Regras específicas para TypeScript       |
| **Prettier**          | 3.x    | Formatação automática e consistente      |
| **Husky**             | 9.x    | Hooks Git automatizados                  |
| **lint-staged**       | 17.x   | Lint e format apenas nos arquivos staged |

### 4.3 Utilitários de Testes

| Tecnologia          | Versão | Papel                                 |
| ------------------- | ------ | ------------------------------------- |
| **@faker-js/faker** | 10.x   | Geração de dados sintéticos           |
| **dayjs**           | 1.x    | Manipulação e formatação de datas     |
| **uuid**            | 14.x   | Geração de identificadores únicos     |
| **dotenv**          | 17.x   | Carregamento de variáveis de ambiente |

### 4.4 Relatórios

| Tecnologia                   | Versão   | Papel                                  |
| ---------------------------- | -------- | -------------------------------------- |
| **allure-playwright**        | 3.x      | Integração Playwright → Allure         |
| **allure-commandline**       | global   | Geração e serviço do relatório Allure  |
| **Playwright HTML Reporter** | built-in | Relatório HTML nativo com trace viewer |

---

## 5. Decisões de Design

### 5.1 Por que Playwright?

O Playwright foi escolhido por reunir capacidades que antes exigiam múltiplas ferramentas:

- **Multi-browser nativo:** Chromium, Firefox e WebKit com uma única API.
- **Automação de API integrada:** `APIRequestContext` sem dependências externas.
- **Paralelismo real:** workers independentes por padrão.
- **Trace Viewer:** gravação de vídeo, screenshot e rede por execução.
- **Modo UI interativo:** depuração visual sem sair do ambiente de desenvolvimento.
- **Auto-wait:** elimina `sleep()` e waits manuais para a maioria dos cenários.

### 5.2 Por que TypeScript?

- Detecção de erros em tempo de compilação antes da execução dos testes.
- Autocompletion preciso para a API do Playwright.
- Refatoração segura em projetos grandes.
- Path aliases (`@pages/*`, `@helpers/*`) sem ambiguidade de imports.

### 5.3 Por que uma configuração base compartilhada?

`playwright.base.config.ts` centraliza decisões que devem ser uniformes em todos os projetos:

- Reporters (todos os projetos geram Allure + HTML + List).
- Configuração de `trace`, `screenshot` e `video` para falhas.
- Definição dos browsers.
- Leitura de variáveis de ambiente.

Cada projeto estende a base com `...baseConfig` e sobrescreve apenas o `testDir`.

### 5.4 Por que não npm workspaces?

A abordagem de raiz compartilhada com projetos em subpastas foi escolhida por:

- **Simplicidade:** um único `node_modules`, um único `package.json`.
- **Menos overhead:** sem necessidade de resolver versões entre workspaces.
- **Onboarding mais rápido:** um único `npm install` configura toda a workspace.
- **Adequação ao contexto:** projetos de automação compartilham a mesma stack — não há necessidade de isolamento de dependências.

npm workspaces seria mais adequado se cada projeto precisasse de versões diferentes das mesmas bibliotecas.

### 5.5 Por que Allure?

O Allure foi escolhido como reporter principal por:

- Suporte a categorias de falha, histórico de execuções e tendências.
- Integração com sistemas de CI/CD (Jenkins, GitHub Actions, GitLab).
- Evidências ricas: screenshots, vídeos e traces por caso de teste.
- Interface visual superior ao HTML nativo do Playwright para apresentação a stakeholders.

O HTML reporter do Playwright é mantido como reporter secundário pelo Trace Viewer integrado.

---

## 6. Qualidade de Código

### 6.1 ESLint (flat config)

A configuração adota o formato flat config (`eslint.config.cjs`) com as seguintes camadas:

1. `js.configs.recommended` — regras base do JavaScript.
2. `tseslint.configs.recommended` — regras específicas do TypeScript.
3. `eslint-config-prettier` — desativa regras que conflitam com Prettier.

Regras customizadas:

- `@typescript-eslint/no-unused-vars` → erro (exceto variáveis prefixadas com `_`).
- `@typescript-eslint/no-explicit-any` → aviso.
- `@typescript-eslint/explicit-function-return-type` → desativado (inferência do TypeScript é suficiente).

### 6.2 Prettier

Configuração em `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### 6.3 Husky + lint-staged

O hook `pre-commit` executa `lint-staged` automaticamente, garantindo que nenhum código com erro de lint ou formatação incorreta seja commitado:

```
*.ts        → eslint --fix + prettier --write
*.json, *.md → prettier --write
```

---

## 7. Estratégia de Relatórios

### 7.1 Reporters configurados

Três reporters são executados simultaneamente em cada run:

| Reporter            | Saída                | Finalidade                              |
| ------------------- | -------------------- | --------------------------------------- |
| `allure-playwright` | `allure-results/`    | Relatório executivo para stakeholders   |
| `html`              | `playwright-report/` | Depuração com Trace Viewer              |
| `list`              | Terminal             | Feedback em tempo real durante execução |

### 7.2 Evidências automáticas por falha

Configurado em `playwright.base.config.ts`:

- **Screenshot:** `only-on-failure` — capturado apenas em falhas.
- **Video:** `on-first-retry` — gravado na primeira retentativa.
- **Trace:** `on-first-retry` — gravado na primeira retentativa (inclui rede, console e DOM snapshots).

### 7.3 Geração do relatório Allure

```bash
# Gerar
allure generate allure-results --clean -o allure-report

# Visualizar
allure open allure-report

# Ou servir diretamente dos resultados brutos
allure serve allure-results
```

---

## 8. Escalabilidade Multi-Projeto

### 8.1 Adicionar um novo projeto

Criar a estrutura:

```bash
mkdir -p projects/<nome>/tests/e2e projects/<nome>/tests/api
mkdir -p projects/<nome>/pages projects/<nome>/fixtures
```

Criar `projects/<nome>/playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';
import { baseConfig } from '../../playwright.base.config';

export default defineConfig({
  ...baseConfig,
  testDir: './tests',
});
```

Adicionar scripts no `package.json` raiz:

```json
"test:<nome>": "playwright test --config=projects/<nome>/playwright.config.ts",
"test:<nome>:ui": "playwright test --config=projects/<nome>/playwright.config.ts --ui"
```

### 8.2 Customizações por projeto

Cada projeto pode sobrescrever qualquer configuração da base:

```typescript
export default defineConfig({
  ...baseConfig,
  testDir: './tests',
  // Apenas Chromium para este projeto
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Retry adicional para este projeto
  retries: 3,
});
```

### 8.3 Código compartilhado

Importar via path aliases:

```typescript
import { BasePage } from '@pages/BasePage';
import { formatDate } from '@helpers/date.helper';
```

---

## 9. Integração com CI/CD

O arquivo `.github/workflows/playwright.yml` gerado pelo `npm init playwright@latest` serve como ponto de partida para pipelines GitHub Actions.

### 9.1 Execução por projeto no pipeline

```yaml
- name: Run tests
  run: npm run test:example

- name: Generate Allure Report
  run: |
    allure generate allure-results --clean -o allure-report

- name: Upload Allure Report
  uses: actions/upload-artifact@v4
  with:
    name: allure-report
    path: allure-report/
```

### 9.2 Variáveis de ambiente no CI

No CI, as variáveis devem ser configuradas como secrets no repositório e injetadas via:

```yaml
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  API_URL: ${{ secrets.API_URL }}
```

---

## 10. Conclusão

O Workspace Playwright estabelece uma base sólida para automação de testes profissional com:

- **Padronização** — estrutura, tooling e práticas consistentes em todos os projetos.
- **Reutilização** — código compartilhado disponível via path aliases sem duplicação.
- **Qualidade** — gates automatizados que previnem regressão de padrões de código.
- **Visibilidade** — relatórios ricos em evidências para times técnicos e stakeholders.
- **Escalabilidade** — novos projetos integrados em minutos, não dias.

A adoção desta workspace reduz o tempo de setup de novos projetos de automação e permite que o time de QE foque na cobertura de testes em vez de infraestrutura.
