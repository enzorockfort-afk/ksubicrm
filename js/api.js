import { FIREBASE, CRM_EMAIL } from "./config.js";

/* Выбирает бэкенд: Firebase, если заполнен конфиг, иначе демо в браузере. */
export const api = await (FIREBASE.apiKey
  ? import("./backend/firebase.js").then((m) => m.createFirebase(FIREBASE, CRM_EMAIL))
  : import("./backend/local.js").then((m) => m.createLocal()));

const ERRORS = {
  "auth/invalid-credential": "Неверный пароль",
  "auth/wrong-password": "Неверный пароль",
  "auth/user-not-found": "Неверный пароль",
  "auth/invalid-email": "В config.js не указан CRM_EMAIL",
  "auth/missing-email": "В config.js не указан CRM_EMAIL",
  "auth/too-many-requests": "Слишком много попыток. Попробуйте позже",
  "auth/network-request-failed": "Нет соединения с интернетом",
  "auth/operation-not-allowed": "В Firebase не включён вход по Email/Password",
  "auth/invalid-api-key": "Неверный apiKey в config.js",
  "permission-denied": "Нет доступа к базе: проверьте правила Firestore (email в правилах должен совпадать с CRM_EMAIL)",
  "not-found": "База Firestore не создана: Firebase Console → Firestore Database → Create database",
  "quota-exceeded": "В браузере закончилось место",
};
export const errorText = (e) => ERRORS[e?.code] || e?.message || "Что-то пошло не так. Попробуйте ещё раз";
