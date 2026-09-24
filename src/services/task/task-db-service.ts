import { DB_NAME, TASK_DB_VERSION, TASKS_STORE } from "@/lib/constants/database-constants";
import { Task } from "@/types/tasks";
import { openDatabase } from "../database/database-service";

export const createTaskService = async (task: Task): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE, "readwrite");
    const store = transaction.objectStore(TASKS_STORE);

    store.add(task);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE, "readonly");
    const store = transaction.objectStore(TASKS_STORE);
    const request = store.index("userId").getAll(userId);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateTaskService = async (task: Task): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE, "readwrite");
    const store = transaction.objectStore(TASKS_STORE);

    store.put(task);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const deleteTaskService = async (taskId: string): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE, "readwrite");
    const store = transaction.objectStore(TASKS_STORE);

    store.delete(taskId);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const updateTasksService = async (tasks: Task[]): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE, "readwrite");
    const store = transaction.objectStore(TASKS_STORE);

    tasks.forEach((task) => {
      store.put(task);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};