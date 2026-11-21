/* Демо-бэкенд: всё хранится в IndexedDB этого браузера. */
const DB = "ksubi-crm";
let dbp;
function open() {
  dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function get(key, fallback) {
  const db = await open();
  return new Promise((res) => {
    const r = db.transaction("kv").objectStore("kv").get(key);
    r.onsuccess = () => res(r.result ?? fallback);
    r.onerror = () => res(fallback);
  });
}
async function set(key, val) {
  const db = await open();
  return new Promise((res, rej) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(val, key);
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
  });
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* одна коллекция = один массив документов */
function collection(key) {
  return {
    list: () => get(key, []),
    async save(data) {
      const list = await get(key, []);
      const doc = { ...data, id: data.id || uid(), updatedAt: Date.now() };
      doc.createdAt ||= Date.now();
      const i = list.findIndex((x) => x.id === doc.id);
      i >= 0 ? (list[i] = doc) : list.unshift(doc);
      await set(key, list);
      return doc;
    },
    async update(id, patch) {
      const list = await get(key, []);
      const x = list.find((o) => o.id === id);
      if (x) Object.assign(x, patch, { updatedAt: Date.now() });
      await set(key, list);
      return x;
    },
    async remove(id) {
      await set(key, (await get(key, [])).filter((x) => x.id !== id));
    },
  };
}

export async function createLocal() {
  await open();
  const products = collection("products");
  const orders = collection("orders");
  const requests = collection("requests");

  return {
    mode: "demo",
    products: {
      list: products.list,
      save: async (p) => (await products.save(p)).id,
      remove: products.remove,
    },
    orders: {
      all: orders.list,
      create: (o) => orders.save({ ...o, status: "new", createdAt: Date.now() }),
      update: orders.update,
    },
    requests: {
      all: requests.list,
      create: (r) => requests.save({ ...r, status: "new", createdAt: Date.now() }),
      update: requests.update,
    },
    /* CRM-коллекции: clients, tasks (а также импорт любых коллекций) */
    crm: {
      list: (col) => collection(col).list(),
      save: (col, data) => collection(col).save(data),
      remove: (col, id) => collection(col).remove(id),
    },
  };
}
