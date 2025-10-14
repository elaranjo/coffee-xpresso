# Espresso Statement

Interface de extrato da conta digital do Espresso desenvolvida em React + TypeScript. O projeto replica o fluxo do desafio técnico: consumir dados do período informado, exibir o desempenho mensal em um gráfico de linha e listar as movimentações com fidelidade visual ao protótipo.

## Stack e decisões
- React 19 + Vite para um setup rápido e moderno.
- MUI 7 (`@mui/material` e `@mui/x-charts`) para montar a UI com o layout do Figma — cabeçalho, chips de filtro, tabela e o gráfico de saídas.
- React Query para cache e gerenciamento de requisições.
- Zod para normalizar a estrutura vinda da API e manter o app resiliente.
- Day.js para parse, formatação e cálculos de datas.

## Estrutura atômica
- `src/components/atoms`: elementos reutilizáveis de menor nível (ex.: `Amount`, `TransactionBadge`).
- `src/components/molecules`: composições simples (ex.: `TransactionItem`, `MetricCard`).
- `src/components/organisms`: blocos complexos com regra de negócio (ex.: `StatementLineChart`, `TransactionsTable`, `StatementHeader`).
- `src/components/templates`: layout da página de extrato.
- `src/pages`: telas consumindo os templates (`StatementPage`).
- Suporte adicional em `src/services`, `src/hooks`, `src/theme`, `src/utils` e `src/mocks`.

## Dados e fallback
- Endpoint oficial: `https://espresso-banking-api-q3-2025-bb3079ecefeb.herokuapp.com/statements`.
- Caso a API não responda, o app cai automaticamente em `src/mocks/statement-mock.ts`, garantindo a navegação do avaliador.
- Os filtros expostos (mês e chips de produto) recalculam valores, série do gráfico (somente saídas, conforme especificação) e a grade de transações em tempo real.

## Como rodar
1. `npm install`
2. `npm run dev` para ambiente local em `http://localhost:5173`
3. `npm run lint` para checar estilos e boas práticas
4. `npm run build` para gerar a versão de produção

## Publicação
- O resultado foi pensado para deploy em serviços estáticos (Vercel, Netlify, etc.). Basta apontar o build (`npm run build`) e servir o diretório `dist/`.
