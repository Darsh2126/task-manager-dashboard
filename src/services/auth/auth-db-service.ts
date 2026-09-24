import {
  DB_NAME,
  DB_VERSION,
  SESSION_STORE,
  USERS_STORE,
} from "@/lib/constants/auth-constants";
import { Session, User } from "@/types/auth";

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const usersStore = db.createObjectStore(USERS_STORE, {
          keyPath: "id",
        });

        usersStore.createIndex("email", "email", {
          unique: true,
        });
      }

      if (!db.objectStoreNames.contains(SESSION_STORE)) {
        db.createObjectStore(SESSION_STORE, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const createUser = async (user: User): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readwrite");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.add(user);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readonly");
    const store = transaction.objectStore(USERS_STORE);
    const index = store.index("email");
    const request = index.get(email);

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const saveSession = async (session: Session): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SESSION_STORE, "readwrite");
    const store = transaction.objectStore(SESSION_STORE);
    const request = store.put({
      id: "current",
      ...session,
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getSession = async (): Promise<Session | undefined> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SESSION_STORE, "readonly");
    const store = transaction.objectStore(SESSION_STORE);
    const request = store.get("current");

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const clearSession = async (): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SESSION_STORE, "readwrite");
    const store = transaction.objectStore(SESSION_STORE);
    const request = store.delete("current");

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getUserById = async (
  userId: string,
): Promise<User | undefined> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readonly");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.get(userId);

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};
