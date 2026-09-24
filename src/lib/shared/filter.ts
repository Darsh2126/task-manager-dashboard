export const searchItems = <T>(
  items: T[],
  searchTerm: string,
  getSearchableText: (item: T) => string,
) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return items;
  }

  return items.filter((item) =>
    getSearchableText(item).toLowerCase().includes(normalizedSearch),
  );
};