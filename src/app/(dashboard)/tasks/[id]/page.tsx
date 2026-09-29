"use client";

import { useAuthStore } from "@/store/auth/auth-store";
import { useTaskStore } from "@/store/task/task-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const TaskIdPage = ({ id }: { id: string }) => {
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const loadTasksById = useTaskStore((state) => state.loadTaskById);
  const taskById = useTaskStore((state) => state.task);

  useEffect(() => {
    if (user && params?.id) {
      loadTasksById(user.id, params?.id as string);
    }
  }, [user, loadTasksById]);


  return (

    <div>
      <p>This is task: {taskById?.id}</p>
      <p>This is task Title: {taskById?.title}</p>
      <p>This is task Status: {taskById?.status}</p>
      <p>This is task Priority: {taskById?.priority}</p>
    </div>
  )
}

export default TaskIdPage