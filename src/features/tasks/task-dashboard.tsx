"use client";

import { useEffect, useState } from "react";

import CreateTaskDialog from "./create-task-dialog";
import FilterBar from "@/features/filters/filter-bar";
import SearchInput from "@/features/filters/search-input";
import SortSelect from "@/features/filters/sort-select";
import TaskBoard from "@/features/tasks/task-board";
import useDebounce from "@/hooks/use-debounce";
import useFilters from "@/hooks/use-filters";
import { SORT_DIRECTION, SORT_OPTION } from "@/lib/enums/filters";
import { TaskPriority } from "@/lib/enums/tasks";
import { searchItems } from "@/lib/shared/filter";
import { sortItems } from "@/lib/shared/sort";
import { useAuthStore } from "@/store/auth/auth-store";
import { useTaskStore } from "@/store/task/task-store";
import PageSizeSelect from "../filters/page-size-select";

const TasksDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const tasks = useTaskStore((state) => state.tasks);
  const loadTasks = useTaskStore((state) => state.loadTasks);

  const { status, priority, from, to } = useFilters();

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SORT_OPTION>(
    SORT_OPTION.NONE,
  );
  const [pageSize, setPageSize] = useState(5);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (user) {
      loadTasks(user.id);
    }
  }, [user, loadTasks]);

  const searchedTasks = searchItems(
    tasks,
    debouncedSearch,
    (task) => `${task.title} ${task.description ?? ""}`,
  );

  const filteredTasks = searchedTasks.filter((task) => {
    const matchesStatus = !status || task.status === status;
    const matchesPriority = !priority || task.priority === priority;

    const taskDate = new Date(task.dueDate);
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    if (fromDate) {
      fromDate.setHours(0, 0, 0, 0);
    }

    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const matchesFrom = !fromDate || taskDate >= fromDate;
    const matchesTo = !toDate || taskDate <= toDate;

    return matchesStatus && matchesPriority && matchesFrom && matchesTo;
  });

  const sortedTasks = sortItems(
    filteredTasks,
    (first, second) => {
      if (
        sortOption === SORT_OPTION.DUE_DATE_ASC ||
        sortOption === SORT_OPTION.DUE_DATE_DESC
      ) {
        return (
          new Date(first.dueDate).getTime() -
          new Date(second.dueDate).getTime()
        );
      }

      if (
        sortOption === SORT_OPTION.PRIORITY_ASC ||
        sortOption === SORT_OPTION.PRIORITY_DESC
      ) {
        const priorityOrder = {
          [TaskPriority.LOW]: 1,
          [TaskPriority.MEDIUM]: 2,
          [TaskPriority.HIGH]: 3,
        };

        return priorityOrder[first.priority] - priorityOrder[second.priority];
      }

      return 0;
    },
    sortOption === SORT_OPTION.DUE_DATE_DESC ||
      sortOption === SORT_OPTION.PRIORITY_DESC
      ? SORT_DIRECTION.DESC
      : SORT_DIRECTION.ASC,
  );

  const handleSortChange = (value: string | null) => {
    if (!value) {
      setSortOption(SORT_OPTION.NONE);
      return;
    }

    setSortOption(value as SORT_OPTION);
  };

  return (
    <div className="flex min-h-full flex-col gap-6 p-6 md:h-full md:min-h-0">
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Tasks Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your tasks across different stages.
          </p>
        </div>
        <CreateTaskDialog formId="create-task-form" />
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <SearchInput value={search} onChange={setSearch} />
        <div className="flex flex-wrap items-center gap-2">
          <FilterBar />
          <SortSelect value={sortOption} onChange={handleSortChange} />
        </div>
      </div>
      <div className="md:min-h-0 md:flex-1">
        <TaskBoard tasks={sortedTasks} pageSize={pageSize} />
      </div>
      <div className="flex shrink-0 justify-end">
        <PageSizeSelect value={pageSize} onChange={setPageSize} />
      </div>
    </div>
  );
};

export default TasksDashboard;
