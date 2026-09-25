import {
  DB_NAME,
  DB_VERSION,
  SESSION_STORE,
  TASKS_STORE,
  USERS_STORE,
} from "@/lib/constants/database-constants";

export const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      const transaction = request.transaction;

      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const store = db.createObjectStore(USERS_STORE, {
          keyPath: "id",
        });

        store.createIndex("email", "email", {
          unique: true,
        });
      } else {
        const store = transaction?.objectStore(USERS_STORE);

        if (store && !store.indexNames.contains("email")) {
          store.createIndex("email", "email", {
            unique: true,
          });
        }
      }

      if (!db.objectStoreNames.contains(SESSION_STORE)) {
        db.createObjectStore(SESSION_STORE, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(TASKS_STORE)) {
        const store = db.createObjectStore(TASKS_STORE, {
          keyPath: "id",
        });

        store.createIndex("userId", "userId", {
          unique: false,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
