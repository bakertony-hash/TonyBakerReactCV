import LayoutSwitcher from "../components/LayoutSwitcher";
import { profile } from "../data/cv";
import type { LayoutId } from "./layoutPreference";

function ExecutiveLayout({
  currentLayout,
  onLayoutChange,
}: {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
}) {
  return (
    <div className="executive-layout">
      <header className="executive-header">
        <a className="executive-wordmark" href="#executive-overview">
          {profile.name}
        </a>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </header>
      <main id="executive-overview" aria-label="Executive CV">
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
      </main>
    </div>
  );
}

export default ExecutiveLayout;
