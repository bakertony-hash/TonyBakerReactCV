import type { LayoutId } from "../layouts/layoutPreference";

const choices: { id: LayoutId; label: string }[] = [
  { id: "interactive", label: "Interactive" },
  { id: "executive", label: "Executive" },
];

function LayoutSwitcher({
  currentLayout,
  onLayoutChange,
  compact = false,
}: {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
  compact?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="CV layout"
      className={
        compact ? "layout-switcher layout-switcher--compact" : "layout-switcher"
      }
    >
      {choices.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={currentLayout === id}
          aria-label={`${label} layout`}
          title={`${label} layout`}
          onClick={() => onLayoutChange(id)}
        >
          <span aria-hidden={compact}>{compact ? label[0] : label}</span>
        </button>
      ))}
    </div>
  );
}

export default LayoutSwitcher;
