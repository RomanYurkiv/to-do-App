# Server for To-Do App

Це бекенд частина для веб-додатку To-Do List. Сервер побудований за допомогою Express.js та Sequelize для взаємодії з базою даних PostgreSQL.

## Стек технологій
- Node.js
- Express.js
- Sequelize
- PostgreSQL
- JWT для аутентифікації
- Typescript

## Встановлення

1. Клонувати репозиторій:
    ```bash
    git clone <repository-url>
    ```

2. Перейдіть до папки `server`:
    ```bash
    cd server
    ```

3. Встановіть залежності:
    ```bash
    npm install
    ```

4. Створіть файл `.env` в кореневій директорії для налаштування змінних середовища:
    ```plaintext
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    JWT_SECRET=your_jwt_secret_key
    ```

5. Запустіть сервер:
    ```bash
    npm run dev
    ```

6. Сервер буде доступний на `http://localhost:5000`.

## Роутери

- `POST /register` - Регістрація нового користувача.
- `POST /login` - Логін користувача.
- `GET /todo-lists` - Отримання всіх списків.
- `GET /todo-lists/:id` - Отримання одного списку за ID.
- `POST /todo-lists` - Створення нового списку.
- `POST /todo-lists/:id/tasks` - Додавання нового завдання до списку.
- `PUT /todo-lists/:id/tasks/:taskId` - Оновлення статусу завдання.

## Важливі файли

- **`server/src/routes/todoList.route.ts`** - Роути для взаємодії з завданнями.
- **`server/src/controllers/todoList.controller.ts`** - Логіка для роботи зі списками та завданнями.
- **`server/src/models/TodoList.ts`** - Моделі для списків та завдань.




# Client for To-Do App

Це фронтенд частина веб-додатку To-Do List, побудована на Next.js з використанням TypeScript і Tailwind CSS.

## Стек технологій
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios для запитів до API

## Встановлення

1. Клонувати репозиторій:
    ```bash
    git clone <repository-url>
    ```

2. Перейдіть до папки `client`:
    ```bash
    cd client
    ```

3. Встановіть залежності:
    ```bash
    npm install
    ```

4. Запустіть фронтенд:
    ```bash
    npm run dev
    ```

5. Фронтенд буде доступний на `http://localhost:3000`.

## Функціональність

- **Аутентифікація:** Реєстрація та логін користувача.
- **Тodolist:** Додавання, перегляд та оновлення списків завдань.
- **Завдання:** Створення завдань, зміна їх статусу на "Виконано".

## Важливі файли

- **`client/src/pages/login.tsx`** - Сторінка для логіна.
- **`client/src/pages/register.tsx`** - Сторінка для реєстрації.
- **`client/src/pages/todo-lists.tsx`** - Сторінка для перегляду списків.
- **`client/src/pages/list/[id].tsx`** - Сторінка для перегляду одного списку.
- **`client/src/components/AuthForm.tsx`** - Компонент форми для аутентифікації.

## Стилі

- **Tailwind CSS** використовується для стилізації компонентів.