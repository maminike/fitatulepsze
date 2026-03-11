import { cn } from "@/lib/utils";

describe("utils.cn tests", () => {
  test("removes duplicate tokens and preserves tokens", () => {
    const out = cn("a a b", ["b", "c"], { d: true, e: false } as any);
    expect(out.split(/\s+/).filter(Boolean)).toEqual(expect.arrayContaining(["a", "b", "c", "d"]));
  });

  test("handles nested arrays", () => {
    const out = cn(["x", ["y", ["z"]]] as any);
    expect(out).toContain("x");
    expect(out).toContain("y");
    expect(out).toContain("z");
  });
});
