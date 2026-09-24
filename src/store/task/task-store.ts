import { create } from "zustand";

import { createTaskService, deleteTaskService, getTasksByUserId, updateTaskService, updateTasksService } from "@/services/task/task-db-service";
import type { Task, TaskState } from "@/types/tasks";
import { TaskStatus } from "@/lib/enums/tasks";

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isCreating: false,
  createTask: async (taskData) => {
    set({ isCreating: true });

    try {

      const now = new Date().toISOString();
      const position = get().tasks.filter(
        (task) => task.status === taskData.status,
      ).length;

      const task: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        position,
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

    const positionCounters: Record<TaskStatus, number> = {
      [TaskStatus.TODO]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.DONE]: 0,
    };

    const normalizedTasks = tasks.map((task) => {
      const position =
        task.position ?? positionCounters[task.status];

      positionCounters[task.status]++;

      return {
        ...task,
        position,
      };
    });

    await updateTasksService(normalizedTasks);

    set({ tasks: normalizedTasks });
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

  reorderTasks: async (activeId, overId) => {
    const currentTasks = get().tasks;

    const activeTask = currentTasks.find((task) => task.id === activeId);
    const overTask = currentTasks.find((task) => task.id === overId);

    if (!activeTask || !overTask) {
      return;
    }

    if (activeTask.status !== overTask.status) {
      return;
    }

    const columnTasks = currentTasks
      .filter((task) => task.status === activeTask.status)
      .sort((a, b) => a.position - b.position);

    const oldIndex = columnTasks.findIndex((task) => task.id === activeId);
    const newIndex = columnTasks.findIndex((task) => task.id === overId);

    if (oldIndex === newIndex) {
      return;
    }

    const reorderedTasks = [...columnTasks];
    const [movedTask] = reorderedTasks.splice(oldIndex, 1);

    reorderedTasks.splice(newIndex, 0, movedTask);

    const updatedColumnTasks = reorderedTasks.map((task, index) => ({
      ...task,
      position: index,
      updatedAt: new Date().toISOString(),
    }));

    const updatedTasks = currentTasks.map((task) => {
      const updatedTask = updatedColumnTasks.find(
        (item) => item.id === task.id,
      );

      return updatedTask ?? task;
    });

    set({ tasks: updatedTasks });

    try {
      await updateTasksService(updatedColumnTasks);
    } catch (error) {
      set({ tasks: currentTasks });
      throw error;
    }
  },

}));