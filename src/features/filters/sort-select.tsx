"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortSelectProps } from "@/types/filters";

const sortLabels: Record<string, string> = {
  none: "Default",
  dueDateAsc: "Due date ↑",
  dueDateDesc: "Due date ↓",
  priorityAsc: "Priority ↑",
  priorityDesc: "Priority ↓",
};

const SortSelect = ({ value, onChange }: SortSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by">
          {sortLabels[value] ?? "Sort by"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Default</SelectItem>
        <SelectItem value="dueDateAsc">Due date ↑</SelectItem>
        <SelectItem value="dueDateDesc">Due date ↓</SelectItem>
        <SelectItem value="priorityAsc">Priority ↑</SelectItem>
        <SelectItem value="priorityDesc">Priority ↓</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;