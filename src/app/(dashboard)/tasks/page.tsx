"use client";

import { withAuth } from "@/features/auth/with-auth";

const TasksPage = () => <div>Tasks Dashboard</div>;

export default withAuth(TasksPage);
