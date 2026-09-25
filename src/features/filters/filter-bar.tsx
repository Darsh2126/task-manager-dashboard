"use client";

import useFilters from "@/hooks/use-filters";
import { TaskPriority, TaskStatus } from "@/lib/enums/tasks";

import FilterSelect from "./filter-select";
import { Button } from "@/components/ui/button";
import DateRangeFilter from "./date-range-filter";

const FilterBar = () => {
  const {
    status,
    priority,
    updateFilter,
    clearFilters,
    from,
    to,
    updateFilters
  } = useFilters();

  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;
  const hasFilters = Boolean(status || priority || from || to);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        placeholder="Status"
        value={status || "All"}
        options={Object.values(TaskStatus).map((value) => ({
          label: value,
          value,
        }))}
        onChange={(value) =>
          updateFilter("status", value === "all" || value === null ? "" : value)
        }
      />
      <FilterSelect
        placeholder="Priority"
        value={priority || "All"}
        options={Object.values(TaskPriority).map((value) => ({
          label: value,
          value,
        }))}
        onChange={(value) =>
          updateFilter("priority", value === "all" || value === null ? "" : value)
        }
      />
      <DateRangeFilter
        from={fromDate}
        to={toDate}
        onChange={(range) => {
          updateFilters({
            from: range.from ? range.from.toISOString() : "",
            to: range.to ? range.to.toISOString() : "",
          });
        }}
      />
      {hasFilters && (
        <Button
          className="cursor-pointer"
          type="button"
          variant="ghost"
          onClick={clearFilters}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;