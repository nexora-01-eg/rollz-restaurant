import { describe, expect, it } from "vitest";
import { menuCategories } from "./menu";

describe("menu image matching", () => {
  it("assigns a usable image to every visible menu item", () => {
    const items = menuCategories.flatMap((category) => category.items);

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.image.startsWith("/manus-storage/"))).toBe(true);
  });

  it("uses ingredient-specific imagery for the named extra ingredients", () => {
    const extras = menuCategories.find((category) => category.id === "extras")?.items ?? [];
    const imagesByName = new Map(extras.map((item) => [item.name, item.image]));

    expect(imagesByName.get("هالبينو")).toContain("rollz-menu-jalapeno");
    expect(imagesByName.get("موزاريلا")).toContain("rollz-menu-mozzarella");
    expect(imagesByName.get("تومية")).toContain("rollz-menu-garlic-sauce");
    expect(imagesByName.get("مشروم")).toContain("rollz-menu-mushroom");
    expect(imagesByName.get("رومي مدخن")).toContain("rollz-menu-smoked-turkey");
  });
});
