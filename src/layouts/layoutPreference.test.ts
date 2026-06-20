import { afterEach, describe, expect, it, vi } from "vitest";
import {
  LAYOUT_STORAGE_KEY,
  readLayoutPreference,
  writeLayoutPreference,
} from "./layoutPreference";

describe("layout preference", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(["interactive", "static"] as const)(
    "reads the %s layout preference",
    (layout) => {
      const getItem = vi.fn().mockReturnValue(layout);

      expect(readLayoutPreference({ getItem })).toBe(layout);
      expect(getItem).toHaveBeenCalledWith(LAYOUT_STORAGE_KEY);
    },
  );

  it.each([null, "", "magazine", "STATIC"])(
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

  it("falls back to interactive when default storage lookup throws", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("blocked");
    });

    expect(readLayoutPreference()).toBe("interactive");
  });

  it("writes the Static layout preference", () => {
    const setItem = vi.fn();

    writeLayoutPreference("static", { setItem });

    expect(setItem).toHaveBeenCalledWith(LAYOUT_STORAGE_KEY, "static");
  });

  it("swallows storage write failures", () => {
    const setItem = vi.fn(() => {
      throw new DOMException("blocked");
    });

    expect(() => writeLayoutPreference("static", { setItem })).not.toThrow();
  });

  it("swallows default storage lookup failures when writing", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("blocked");
    });

    expect(() => writeLayoutPreference("static")).not.toThrow();
  });
});

