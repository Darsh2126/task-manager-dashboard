import { create } from "zustand";

import { createTaskService, deleteTaskService, getTasksByUserId, updateTaskService } from "@/services/task/task-db-service";
import type { Task, TaskState } from "@/types/tasks";

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isCreating: false,
  createTask: async (taskData) => {
    set({ isCreating: true });

    try {

      const now = new Date().toISOString();

      const task: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      await createTaskService(task);

      set((state) => ({
        tasks: [...state.tasks, task],
      }));
    } finally {
      set({ isCreating: false });
    }
  },

  loadTasks: async (userId) => {
    const tasks = await getTasksByUserId(userId);
    set({ tasks });
  },

  updateTask: async (task) => {
    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString(),
    };

    await updateTaskService(updatedTask);

    set((state) => ({
      tasks: state.tasks.map((item) =>
        item.id === updatedTask.id ? updatedTask : item,
      ),
    }));
  },

  deleteTask: async (taskId) => {
    await deleteTaskService(taskId);

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },

}));