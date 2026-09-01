# Interactive Table in React

Интерактивная таблица на React и TypeScript: выбор ячеек, строк и столбцов, статистика по выделенному диапазону, светлая и тёмная темы. Данные подключаются из локальных JSON-файлов, отдельный бэкенд не нужен.

## Требования

- [Node.js](https://nodejs.org/) `20.19+`

Проверить версии:

```bash
node -v
npm -v
```

## Локальный запуск

1. Склонируйте репозиторий и перейдите в каталог проекта:

```bash
git clone https://github.com/AnSBeliaev/interactive-table-in-react
cd interactive-table-in-react
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите dev-сервер:

```bash
npm run dev
```

4. Откройте в браузере адрес, который выведет Vite (обычно [http://localhost:5173](http://localhost:5173)).

## Скрипты

| Команда              | Описание                                      |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Dev-сервер с горячей перезагрузкой            |
| `npm run build`      | Проверка типов и production-сборка в `dist/`  |
| `npm run preview`    | Локальный просмотр собранного `dist/`         |
| `npm run lint`       | Проверка ESLint                               |
| `npm run format`     | Форматирование файлов Prettier                |
| `npm run format:check` | Проверка форматирования без изменений       |

Сборка и просмотр production-версии:

```bash
npm run build
npm run preview
```

После `preview` приложение будет доступно по адресу, который выведет Vite (обычно [http://localhost:4173](http://localhost:4173)).

## Наборы данных

В `src/App.tsx` можно переключить объём мок-данных. Файлы лежат в `src/mock-data/`:

- `small_data.json`
- `medium_data.json`
- `big_data.json`

По умолчанию подключён большой набор:

```ts
import mockData from './mock-data/big_data.json';
```

Для меньшего объёма замените импорт и уберите проп `isBigData` у `Table`:

```ts
import mockData from './mock-data/small_data.json';
// ...
<Table data={mockData.data} leftColumns={STATIC_LEFT_COLUMNS} rightColumns={rightColumns} />
```

Для `big_data.json` оставляйте `isBigData` — таблица работает в режиме claims, без нормализации тегов.

## Возможности таблицы

- Выбор ячеек кликом и протягиванием мыши
- Диапазон через `Shift`, множественный выбор через `Ctrl` / `Cmd`
- Выбор целых строк и столбцов
- Счётчики выделенных строк, столбцов, ячеек и сумма значений
- Переключатель светлой и тёмной темы
