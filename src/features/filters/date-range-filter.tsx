"use client";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangeFilterProps } from "@/types/tasks";

const DateRangeFilter = ({
  from,
  to,
  onChange,
}: DateRangeFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button type="button" variant="outline">
          <CalendarIcon />
          {from && to
            ? `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
            : "Due date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          mode="range"
          selected={{
            from,
            to,
          }}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;