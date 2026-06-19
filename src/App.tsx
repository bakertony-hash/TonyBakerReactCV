import { useState } from "react";
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

  const changeLayout = (nextLayout: LayoutId) => {
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
