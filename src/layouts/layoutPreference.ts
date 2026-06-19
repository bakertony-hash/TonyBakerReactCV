export const LAYOUT_STORAGE_KEY = "tony-baker-cv-layout";

export const layoutIds = ["interactive", "executive"] as const;

export type LayoutId = (typeof layoutIds)[number];

export function isLayoutId(value: unknown): value is LayoutId {
  return typeof value === "string" && layoutIds.includes(value as LayoutId);
}

export function readLayoutPreference(
  storage: Pick<Storage, "getItem"> = window.localStorage,
): LayoutId {
  try {
    const storedLayout = storage.getItem(LAYOUT_STORAGE_KEY);
    return isLayoutId(storedLayout) ? storedLayout : "interactive";
  } catch {
    return "interactive";
  }
}

export function writeLayoutPreference(
  layout: LayoutId,
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  try {
    storage.setItem(LAYOUT_STORAGE_KEY, layout);
  } catch {
    // Persistence is optional when storage is unavailable.
  }
}
