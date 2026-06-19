import InteractiveLayout from "./layouts/InteractiveLayout";

function App() {
  return (
    <InteractiveLayout
      currentLayout="interactive"
      onLayoutChange={() => undefined}
    />
  );
}

export default App;
