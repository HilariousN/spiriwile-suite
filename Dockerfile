# Використовуємо офіційний образ Python
FROM python:3.11-slim

# Встановлюємо робочу директорію
WORKDIR /app

# Встановлюємо залежності
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо файли проекту
COPY . .

# Налаштовуємо змінні середовища
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Відкриваємо порт
EXPOSE 5000

# Запускаємо Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--workers", "4"] 