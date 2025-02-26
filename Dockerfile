# Используем официальный образ Node.js
FROM node:18 AS builder

# Создаем рабочую директорию
WORKDIR /app

# Копируем остальные файлы приложения
COPY . .

# Устанавливаем зависимости и собираем проект
RUN npm ci && npm run build

# Финальный образ
FROM node:18

# Создаем рабочую директорию
WORKDIR /app

# Копируем только необходимые файлы из builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/config ./config
COPY --from=builder /app/.env .env


# Устанавливаем только production зависимости и очищаем кэш npm
RUN npm ci --only=production && npm cache clean --force

# Копируем wait-for-it.sh и устанавливаем права доступа
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Указываем порт, который будет использоваться приложением
EXPOSE 5350

# Команда для выполнения миграций и запуска приложения
CMD ["sh", "-c", "/usr/local/bin/wait-for-it.sh psql:5432 --strict --timeout=300 -- npx sequelize-cli db:migrate && node dist/main"]