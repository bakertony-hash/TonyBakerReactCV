import { useEffect, useState } from "react";
import ExecutiveLayout from "./layouts/ExecutiveLayout";
import InteractiveLayout from "./layouts/InteractiveLayout";
import {
  readLayoutPreference,
  writeLayoutPreference,
  type LayoutId,
} from "./layouts/layoutPreference";

function App() {
  const [currentLayout, setCurrentLayout] = useState<LayoutId>(() =>
    readLayoutPreference(),
  );
  const [pendingLayoutFocus, setPendingLayoutFocus] = useState<LayoutId | null>(
    null,
  );

  useEffect(() => {
    if (pendingLayoutFocus !== currentLayout) return;

    const label = `${currentLayout === "executive" ? "Executive" : "Interactive"} layout`;
    const activeChoice = document.querySelector<HTMLButtonElement>(
      `.layout-switcher button[aria-label="${label}"][aria-pressed="true"]`,
    );

    activeChoice?.focus();
    setPendingLayoutFocus(null);
  }, [currentLayout, pendingLayoutFocus]);

  const changeLayout = (nextLayout: LayoutId) => {
    if (nextLayout === currentLayout) return;

    setPendingLayoutFocus(nextLayout);
    setCurrentLayout(nextLayout);
    writeLayoutPreference(nextLayout);
  };

  if (currentLayout === "executive") {
    return (
      <ExecutiveLayout
        currentLayout={currentLayout}
        onLayoutChange={changeLayout}
      />
    );
  }

  return (
    <InteractiveLayout
      currentLayout={currentLayout}
      onLayoutChange={changeLayout}
    />
  );
}

export default App;
