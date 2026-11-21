/* =========================================================
   KSUBI CRM — настройки
   ========================================================= */
export const SHOP = {
  name: "Ksubi Store",
  currency: "лей",
};

/* =========================================================
   FIREBASE — облачная база (необязательно).
   Пока apiKey пустой — CRM работает в ДЕМО-режиме:
   данные хранятся только в этом браузере.
   Как подключить — см. README.md
   ========================================================= */
export const FIREBASE = {
  apiKey: "AIzaSyC5I5DvmEhLZhTJnEDrP3t6QHjyfK_W_C4",
  authDomain: "ksubicrm.firebaseapp.com",
  projectId: "ksubicrm",
  storageBucket: "ksubicrm.firebasestorage.app",
  messagingSenderId: "1007392520318",
  appId: "1:1007392520318:web:ded05a3e8f52d5fd66c02f",
};

/* Вход в CRM: вводится только пароль.
   - Демо-режим: пароль сверяется с хэшем ниже (сам пароль в коде не хранится).
     Сейчас пароль: rorosazd
     Сменить: node -e "console.log(require('crypto').createHash('sha256').update('ksubi-crm:НОВЫЙ').digest('hex'))"
   - Режим Firebase: вход в аккаунт владельца CRM_EMAIL с этим паролем
     (аккаунт создаётся в Firebase Console → Authentication → Users → Add user).
     Тот же email должен стоять в firestore.rules. */
export const CRM_EMAIL = "babaevdavid88@gmail.com";
export const CRM_PASS_HASH = "cc73ad3ad2a97a952bd809a1f5d13b430b0624c93e57bb8bcc7ce541a47c946a";

export const CATEGORIES = ["Обувь", "Одежда", "Аксессуары", "Сумки"];
export const REQUEST_STATUSES = {
  new: "Новая",
  progress: "Ищем",
  offered: "Предложение",
  prepaid: "Предоплата",
  ordered: "Выкуплено",
  transit: "В пути",
  arrived: "Приехало",
  done: "Выдано",
  cancelled: "Отменена",
};
export const SOURCES = { instagram: "Instagram", telegram: "Telegram", whatsapp: "WhatsApp", viber: "Viber", tiktok: "TikTok", offline: "Лично", other: "Другое" };
export const ORDER_STATUSES = {
  new: "Новый",
  confirmed: "Подтверждён",
  ready: "Встреча назначена",
  shipping: "Отправлен",
  done: "Выдан",
  cancelled: "Отменён",
};
