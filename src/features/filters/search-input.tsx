"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SearchInputProps } from "@/types/filters";

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks..."
        className="pl-9"
      />
    </div>
  );
};

export default SearchInput;
