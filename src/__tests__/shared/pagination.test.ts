import { paginateItems } from "@/lib/shared/pagination";

describe("paginateItems", () => {
  it("returns the correct items for the requested page", () => {
    const items = [1, 2, 3, 4, 5, 6];

    const result = paginateItems(items, 2, 3);

    expect(result.items).toEqual([4, 5, 6]);
    expect(result.totalItems).toBe(6);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(2);
  });
});