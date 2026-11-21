# Ksubi CRM

CRM для **Ksubi Store**: сделки, клиенты, склад, задачи. Отдельное приложение без сайта магазина. Вход — по паролю.

Пароль: **`rorosazd`**

## Разделы

- **Сегодня** — выручка и прибыль за месяц, задачи и встречи, новые сделки, что заканчивается на складе, кто ждёт оплату.
- **Сделки** — воронки «Под заказ» и «Наличие», карточки перетаскиваются между этапами. В сделке: продажа, закупка, доставка, предоплата → прибыль и остаток; поставщик, трек-номер, срок, заметки.
- **Клиенты** — собираются из сделок по номеру телефона; размеры, бренды, метки, история покупок, кнопки «Позвонить / WhatsApp / Viber / Telegram / Instagram».
- **Склад** — товары (бренд, название, фото, цена, закупка, размеры) и остатки по размерам. Сделка из наличия сама списывает остаток, отмена — возвращает.
- **Задачи** — встречи, звонки, дела.
- **Данные** — резервная копия (скачать / загрузить JSON), выход.

## Как выложить на GitHub Pages

1. Создать новый репозиторий на GitHub (например, `ksubi-crm`).
2. Загрузить в него **все файлы из этой папки** (Add file → Upload files), сохраняя папки `assets`, `css`, `js`.
3. **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**
4. Через 1–2 минуты CRM откроется по адресу `https://ВАШ-ЛОГИН.github.io/ksubi-crm/`.

CRM работает сразу, без настройки.

## Где хранятся данные

- **Демо-режим** (по умолчанию, Firebase не подключён): данные хранятся только в том браузере, где вы работаете. Пароль сверяется с хэшем `CRM_PASS_HASH` в `js/config.js` (сам пароль в коде не хранится). Не забывайте делать «Данные → Скачать копию».
- **С Firebase** (бесплатно): данные в облаке, одинаковые на телефоне и компьютере, защищены Firebase Auth и правилами `firestore.rules`.

## Подключение Firebase (по желанию)

1. https://console.firebase.google.com → **Create a project** → имя `ksubi-crm` → Google Analytics можно выключить → **Create project**.
2. **Build → Authentication → Get started → Email/Password → Enable → Save.**
3. **Authentication → Users → Add user**: ваш email и пароль **`rorosazd`**.
4. **Build → Firestore Database → Create database** → регион `eur3 (europe-west)` → **Start in production mode** → Create.
5. **Firestore Database → Rules**: вставить содержимое `firestore.rules`, заменив `ВАШ_EMAIL@gmail.com` на email из шага 3 (маленькими буквами) → **Publish**.
6. **⚙ Project settings → General → Your apps → значок `</>` (Web)** → имя `ksubi-crm` → **Register app** (Hosting не нужен) → скопировать блок `firebaseConfig`.
7. В `js/config.js`: вставить значения из `firebaseConfig` в `FIREBASE`, а в `CRM_EMAIL` — email из шага 3.
8. Загрузить изменённый `js/config.js` в репозиторий на GitHub и войти в CRM паролем `rorosazd`.

`apiKey` в `firebaseConfig` — не секрет, его можно хранить в открытом репозитории: данные защищают вход по паролю и правила Firestore.

Если CRM уже велась в демо-режиме: «Данные → Скачать копию» → подключить Firebase → войти → «Загрузить копию».

## Сменить пароль

- **Демо-режим**: посчитать новый хэш и вставить в `CRM_PASS_HASH` в `js/config.js`:
  ```
  node -e "console.log(require('crypto').createHash('sha256').update('ksubi-crm:НОВЫЙ_ПАРОЛЬ').digest('hex'))"
  ```
- **Firebase**: сменить пароль пользователя в Authentication → Users.

## Файлы

```
index.html            — интерфейс CRM
css/crm.css           — стили (небесно-голубой, белый, серый)
js/config.js          — настройки: пароль, Firebase, статусы, источники
js/crm.js             — логика CRM
js/api.js             — выбор хранилища (браузер или Firebase)
js/backend/local.js   — хранение в браузере (IndexedDB)
js/backend/firebase.js— хранение в Firebase
js/ui.js, images.js   — помощники интерфейса, сжатие фото
assets/               — логотип и иконки
firestore.rules       — правила доступа Firebase
```
