import { describe, expect, it, vi } from "vitest";
import {
  LAYOUT_STORAGE_KEY,
  readLayoutPreference,
  writeLayoutPreference,
} from "./layoutPreference";

describe("layout preference", () => {
  it("reads the executive layout preference", () => {
    const getItem = vi.fn().mockReturnValue("executive");

    expect(readLayoutPreference({ getItem })).toBe("executive");
    expect(getItem).toHaveBeenCalledWith(LAYOUT_STORAGE_KEY);
  });

  it.each([null, "", "magazine", "EXECUTIVE"])(
    "falls back to interactive for invalid stored value %s",
    (storedValue) => {
      const getItem = vi.fn().mockReturnValue(storedValue);

      expect(readLayoutPreference({ getItem })).toBe("interactive");
    },
  );

  it("falls back to interactive when storage access throws", () => {
    const getItem = vi.fn(() => {
      throw new DOMException("blocked");
    });

    expect(readLayoutPreference({ getItem })).toBe("interactive");
  });

  it("writes the executive layout preference", () => {
    const setItem = vi.fn();

    writeLayoutPreference("executive", { setItem });

    expect(setItem).toHaveBeenCalledWith(LAYOUT_STORAGE_KEY, "executive");
  });

  it("swallows storage write failures", () => {
    const setItem = vi.fn(() => {
      throw new DOMException("blocked");
    });

    expect(() => writeLayoutPreference("executive", { setItem })).not.toThrow();
  });
});
