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

    const sourceTasks = currentTasks
      .filter((task) => task.status === activeTask.status)
      .sort((a, b) => a.position - b.position);

    const destinationStatus = overTask.status;

    const destinationTasks = currentTasks
      .filter((task) => task.status === destinationStatus)
      .sort((a, b) => a.position - b.position);

    if (activeTask.status === destinationStatus) {
      const oldIndex = sourceTasks.findIndex(
        (task) => task.id === activeId,
      );
      const newIndex = sourceTasks.findIndex(
        (task) => task.id === overId,
      );

      if (oldIndex === newIndex) {
        return;
      }

      const reorderedTasks = [...sourceTasks];
      const [movedTask] = reorderedTasks.splice(oldIndex, 1);

      reorderedTasks.splice(newIndex, 0, movedTask);

      const updatedTasks = reorderedTasks.map((task, index) => ({
        ...task,
        position: index,
        updatedAt: new Date().toISOString(),
      }));

      const nextTasks = currentTasks.map((task) => {
        const updatedTask = updatedTasks.find(
          (item) => item.id === task.id,
        );

        return updatedTask ?? task;
      });

      set({ tasks: nextTasks });

      try {
        await updateTasksService(updatedTasks);
      } catch (error) {
        set({ tasks: currentTasks });
        throw error;
      }

      return;
    }

    const updatedSourceTasks = sourceTasks
      .filter((task) => task.id !== activeId)
      .map((task, index) => ({
        ...task,
        position: index,
        updatedAt: new Date().toISOString(),
      }));

    const destinationIndex = destinationTasks.findIndex(
      (task) => task.id === overId,
    );

    const movedTask = {
      ...activeTask,
      status: destinationStatus,
    };

    const nextDestinationTasks = [...destinationTasks];

    nextDestinationTasks.splice(destinationIndex, 0, movedTask);

    const updatedDestinationTasks = nextDestinationTasks.map(
      (task, index) => ({
        ...task,
        position: index,
        updatedAt: new Date().toISOString(),
      }),
    );

    const changedTasks = [
      ...updatedSourceTasks,
      ...updatedDestinationTasks,
    ];

    const nextTasks = currentTasks.map((task) => {
      const updatedTask = changedTasks.find(
        (item) => item.id === task.id,
      );

      return updatedTask ?? task;
    });

    set({ tasks: nextTasks });

    try {
      await updateTasksService(changedTasks);
    } catch (error) {
      set({ tasks: currentTasks });
      throw error;
    }
  },

  moveTaskToColumn: async (taskId, status) => {
    const currentTasks = get().tasks;

    const task = currentTasks.find((item) => item.id === taskId);

    if (!task || task.status === status) {
      return;
    }

    const position = currentTasks.filter(
      (item) => item.status === status,
    ).length;

    const updatedTask = {
      ...task,
      status,
      position,
      updatedAt: new Date().toISOString(),
    };

    const updatedSourceTasks = currentTasks
      .filter((item) => item.status === task.status && item.id !== taskId)
      .map((item, index) => ({
        ...item,
        position: index,
        updatedAt: new Date().toISOString(),
      }));

    const nextTasks = currentTasks.map((item) => {
      if (item.id === taskId) {
        return updatedTask;
      }

      const updatedSourceTask = updatedSourceTasks.find(
        (sourceTask) => sourceTask.id === item.id,
      );

      return updatedSourceTask ?? item;
    });

    set({ tasks: nextTasks });

    try {
      await updateTasksService([
        updatedTask,
        ...updatedSourceTasks,
      ]);
    } catch (error) {
      set({ tasks: currentTasks });
      throw error;
    }
  },

}));