# DentEvidence v0.4

## Деплой на Vercel

1. Загрузи папку на GitHub
2. Зайди на vercel.com → New Project → Import
3. В настройках добавь переменную окружения:
   - Name: `ANTHROPIC_API_KEY`
   - Value: твой ключ `sk-ant-...`
4. Нажми Deploy

## Локальный запуск

```bash
npm install
# создай .env файл с ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```
