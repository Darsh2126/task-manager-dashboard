import { searchItems } from "@/lib/shared/filter";

describe("searchItems", () => {
  const tasks = [
    {
      title: "Fix login bug",
      description: "Authentication issue",
    },
    {
      title: "Update dashboard",
      description: "Improve task filters",
    },
    {
      title: "Write documentation",
      description: "Add project README",
    },
  ];

  const getSearchableText = (task: (typeof tasks)[number]) =>
    `${task.title} ${task.description}`;

  it("returns all items when search term is empty", () => {
    const result = searchItems(tasks, "", getSearchableText);

    expect(result).toEqual(tasks);
  });

  it("searches across title and description", () => {
    const result = searchItems(tasks, "authentication", getSearchableText);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Fix login bug");
  });

  it("searches case-insensitively", () => {
    const result = searchItems(tasks, "DASHBOARD", getSearchableText);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Update dashboard");
  });

  it("returns no items when there is no match", () => {
    const result = searchItems(tasks, "xyz", getSearchableText);

    expect(result).toHaveLength(0);
  });
});