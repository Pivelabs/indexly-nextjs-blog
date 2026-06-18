"use client";

import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";

type SearchInputProps = {
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function SearchInput({
  defaultValue = "",
  placeholder = "Search posts...",
  onChange,
}: SearchInputProps) {
  const handleChange = useDebouncedCallback(
    (value: string) => {
      onChange?.(value);
    },
    300
  );

  return (
    <Input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}