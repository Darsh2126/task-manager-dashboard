import { SORT_DIRECTION } from "../enums/filters";

export type SortDirection = SORT_DIRECTION;

export const sortItems = <T>(
  items: T[],
  compare: (first: T, second: T) => number,
  direction: SortDirection = SORT_DIRECTION.ASC,
) => {
  const sortedItems = [...items].sort(compare);

  return direction === "desc" ? sortedItems.reverse() : sortedItems;
};