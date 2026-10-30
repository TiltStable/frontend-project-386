# AGENTS.md

Учебный проект Хекслета «Календарь звонков»: владелец публикует типы встреч
и доступное время, гость без регистрации бронирует свободный слот.

## Структура

- `apps/backend` — API на Hono (TypeScript), порт 3000 (env `PORT`).
- `apps/frontend` — React 19 + Vite + Mantine, порт 5173.
- `contracts` — TypeSpec-контракт API. `contracts/tsp-output/` генерируется,
  руками не править.
- `apps/frontend/src/api-client` — клиентский SDK, генерируется из OpenAPI,
  руками не править.

Порядок правки контракта: `contracts/*.tsp` → `npm run contract:build` →
`npm run client:generate`.

## Команды

Инструменты и версии зафиксированы в `mise.toml` (Node >= 22.18, фактически 24
через mise). Все npm-скрипты работают и без mise.

- `mise run check` — все проверки: lint, format, typecheck, test, build
- `npm run check` — те же проверки без mise
- `mise daemons start` / `mise daemons stop` / `mise daemons status` — фоновые
  dev-серверы (backend + frontend)
- `npm run dev:backend` / `npm run dev:frontend` — те же серверы по отдельности
- `npm test` — Vitest
- `npm run lint` / `npm run format:check` — oxlint и oxfmt
- `npm run contract:build` — TypeSpec → OpenAPI
- `npm run client:generate` — OpenAPI → TypeScript SDK

## Правила

- Коммиты строго по Conventional Commits (`feat:`, `fix:`, ...); commit-msg
  хук отклоняет остальные форматы.
- Не менять `.github/workflows/hexlet-check.yml`.
- Новая функциональность — с тестами (Vitest).
