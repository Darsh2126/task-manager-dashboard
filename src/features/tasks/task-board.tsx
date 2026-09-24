"use client";

import {
  DndContext,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import { useTaskStore } from "@/store/task/task-store";
import { TaskStatus } from "@/lib/enums/tasks";
import TaskColumn from "@/features/tasks/task-column";

const TaskBoard = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const moveTaskToColumn = useTaskStore((state) => state.moveTaskToColumn);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const overTask = tasks.find((task) => task.id === over.id);

    if (overTask) {
      await reorderTasks(String(active.id), overTask.id);
      return;
    }

    const destinationStatus = Object.values(TaskStatus).find(
      (status) => status === over.id,
    );

    if (!destinationStatus) {
      return;
    }

    await moveTaskToColumn(String(active.id), destinationStatus);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        <TaskColumn
          title={TaskStatus.TODO}
          tasks={tasks.filter((task) => task.status === TaskStatus.TODO)}
        />
        <TaskColumn
          title={TaskStatus.IN_PROGRESS}
          tasks={tasks.filter(
            (task) => task.status === TaskStatus.IN_PROGRESS,
          )}
        />
        <TaskColumn
          title={TaskStatus.DONE}
          tasks={tasks.filter((task) => task.status === TaskStatus.DONE)}
        />
      </div>
    </DndContext>
  );
};

export default TaskBoard;
