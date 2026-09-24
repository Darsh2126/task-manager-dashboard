export const paginateItems = <T>(
  items: T[],
  page: number,
  pageSize: number,
) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    totalItems,
    totalPages,
    currentPage: page,
  };
};