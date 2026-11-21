/* Облачный бэкенд: Firebase Auth + Firestore (бесплатный тариф Spark).
   Фото товаров хранятся в Firestore в сжатом виде — Cloud Storage не нужен. */
const V = "10.12.2";
const CDN = `https://www.gstatic.com/firebasejs/${V}`;

export async function createFirebase(config, ownerEmail = "") {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`${CDN}/firebase-app.js`),
    import(`${CDN}/firebase-auth.js`),
    import(`${CDN}/firebase-firestore.js`),
  ]);
  const app = initializeApp(config);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);
  const { doc, collection, getDocs, setDoc, updateDoc, deleteDoc, addDoc } = F;

  const withId = (s) => ({ ...s.data(), id: s.id });
  const byNew = (a, b) => (b.createdAt || 0) - (a.createdAt || 0);

  /* Владелец CRM — аккаунт с email из CRM_EMAIL. Данные защищают правила firestore.rules
     с тем же email: чужой аккаунт не прочитает и не изменит ничего. */
  const owner = ownerEmail.trim().toLowerCase();
  let current = null;
  const listeners = new Set();
  const toUser = (fu) => (fu ? { uid: fu.uid, email: fu.email, isAdmin: !!owner && (fu.email || "").toLowerCase() === owner } : null);
  await new Promise((resolve) => {
    let first = true;
    A.onAuthStateChanged(auth, (fu) => {
      current = toUser(fu);
      listeners.forEach((cb) => cb(current));
      if (first) (first = false), resolve();
    });
  });

  const list = async (col) => (await getDocs(collection(db, col))).docs.map(withId).sort(byNew);
  async function save(col, data) {
    const { id, ...rest } = data;
    rest.updatedAt = Date.now();
    rest.createdAt ||= Date.now();
    const ref = id ? doc(db, col, id) : doc(collection(db, col));
    await setDoc(ref, rest);
    return { ...rest, id: ref.id };
  }
  async function create(col, data) {
    const d = { ...data, status: "new", createdAt: Date.now() };
    const ref = await addDoc(collection(db, col), d);
    return { ...d, id: ref.id };
  }

  return {
    mode: "firebase",
    auth: {
      current: () => current,
      onChange(cb) {
        listeners.add(cb);
        cb(current);
        return () => listeners.delete(cb);
      },
      async signIn(email, password) {
        const c = await A.signInWithEmailAndPassword(auth, email.trim(), password);
        return toUser(c.user);
      },
      signOut: () => A.signOut(auth),
    },
    products: {
      list: () => list("products"),
      save: async (p) => (await save("products", p)).id,
      remove: (id) => deleteDoc(doc(db, "products", id)),
    },
    orders: {
      all: () => list("orders"),
      create: (o) => create("orders", o),
      update: (id, patch) => updateDoc(doc(db, "orders", id), { ...patch, updatedAt: Date.now() }),
    },
    requests: {
      all: () => list("requests"),
      create: (r) => create("requests", r),
      update: (id, patch) => updateDoc(doc(db, "requests", id), { ...patch, updatedAt: Date.now() }),
    },
    /* CRM-коллекции: clients, tasks (только для админа) */
    crm: {
      list,
      save,
      remove: (col, id) => deleteDoc(doc(db, col, id)),
    },
  };
}
