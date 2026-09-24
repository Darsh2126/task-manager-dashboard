"use client";

import { withAuth } from "@/features/auth/with-auth";
import TasksDashboard from "@/features/tasks/task-dashboard";

const TasksPage = () => <TasksDashboard />;

export default withAuth(TasksPage);
