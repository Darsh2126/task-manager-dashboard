"use client";

import { useEffect, useState } from "react";

import CreateTaskDialog from "./create-task-dialog";
import TaskBoard from "@/features/tasks/task-board";
import SearchInput from "@/features/filters/search-input";
import FilterBar from "@/features/filters/filter-bar";
import SortSelect from "@/features/filters/sort-select";
import useDebounce from "@/hooks/use-debounce";
import useFilters from "@/hooks/use-filters";
import { searchItems } from "@/lib/shared/filter";
import { sortItems } from "@/lib/shared/sort";
import {
  SORT_DIRECTION,
  SORT_OPTION,
} from "@/lib/enums/filters";
import { TaskPriority } from "@/lib/enums/tasks";
import { useAuthStore } from "@/store/auth/auth-store";
import { useTaskStore } from "@/store/task/task-store";
import { paginateItems } from "@/lib/shared/pagination";
import PageSizeSelect from "../filters/page-size-select";
import Pagination from "../filters/pagination";

const TasksDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const tasks = useTaskStore((state) => state.tasks);
  const loadTasks = useTaskStore((state) => state.loadTasks);

  const { status, priority, from, to } = useFilters();

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SORT_OPTION>(
    SORT_OPTION.NONE,
  );
  const [page, setPage] = useState(1);
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

    return (
      matchesStatus &&
      matchesPriority &&
      matchesFrom &&
      matchesTo
    );
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

        return (
          priorityOrder[first.priority] -
          priorityOrder[second.priority]
        );
      }

      return 0;
    },
    sortOption === SORT_OPTION.DUE_DATE_DESC ||
      sortOption === SORT_OPTION.PRIORITY_DESC
      ? SORT_DIRECTION.DESC
      : SORT_DIRECTION.ASC,
  );

  const paginatedTasks = paginateItems(sortedTasks, page, pageSize);

  const handleSortChange = (value: string | null) => {
    if (!value) {
      setSortOption(SORT_OPTION.NONE);
      return;
    }

    setSortOption(value as SORT_OPTION);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, priority, from, to, sortOption, pageSize]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={search} onChange={setSearch} />
        <div className="flex flex-wrap items-center gap-2">
          <FilterBar />
          <SortSelect
            value={sortOption}
            onChange={handleSortChange}
          />
        </div>
      </div>
      <TaskBoard tasks={paginatedTasks.items} />
      <div className="flex flex-wrap items-center justify-end gap-3">
        <PageSizeSelect
          value={pageSize}
          onChange={setPageSize}
        />
        <Pagination
          currentPage={page}
          totalPages={paginatedTasks.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default TasksDashboard;
