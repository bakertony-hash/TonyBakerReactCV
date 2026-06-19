import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { expertise, impactHighlights, profile, timeline } from "./data/cv";
import { LAYOUT_STORAGE_KEY } from "./layouts/layoutPreference";

beforeEach(() => {
  window.localStorage.clear();
});

// Top-level suite for the main application component and its interactive behavior.
describe("App", () => {
  it("switches to the executive layout and saves the preference", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Executive layout" }));

    expect(screen.getByRole("main", { name: "Executive CV" })).toBeInTheDocument();
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe("executive");
  });

  it("restores a saved executive layout preference", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");

    render(<App />);

    expect(screen.getByRole("main", { name: "Executive CV" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Executive layout" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches from a saved executive layout to the interactive layout", async () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Interactive layout" }));

    expect(screen.getByRole("complementary", { name: "Primary navigation" })).toBeInTheDocument();
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe("interactive");
  });

  // Verify the top-level profile summary, career impact metrics, and primary call-to-action links.
  it("presents Tony Baker's profile, impact metrics, and primary actions", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: profile.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(profile.title)).toBeInTheDocument();
    expect(screen.getByText(profile.location)).toBeInTheDocument();

    for (const highlight of impactHighlights) {
      expect(screen.getByText(highlight.metric)).toBeInTheDocument();
      expect(screen.getByText(highlight.label)).toBeInTheDocument();
    }

    expect(
      screen.getByRole("link", { name: /start a conversation/i }),
    ).toHaveAttribute("href", `mailto:${profile.email}`);
    expect(screen.getByRole("link", { name: /download cv/i })).toHaveAttribute(
      "download",
    );
  });

  // Ensure selecting a timeline entry updates the experience detail panel with the selected role.
  it("updates the experience detail panel when a timeline role is selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(timeline[0].focus)).toBeInTheDocument();

    const targetEntry = timeline.find((entry) => entry.id === "tesla-europe");
    expect(targetEntry).toBeDefined();

    await user.click(
      screen.getByRole("button", {
        name: /Technical Manager\s*TESLA Europe Limited\s*Jul 2002 - Nov 2010/i,
      }),
    );

    expect(screen.getByText(targetEntry!.focus)).toBeInTheDocument();
    expect(screen.getByText(targetEntry!.location)).toBeInTheDocument();
    for (const bullet of targetEntry!.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
  });

  // Validate that selecting an expertise category changes the displayed capability details.
  it("updates the expertise panel when a capability category is selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(expertise[0].summary)).toBeInTheDocument();

    const leadership = expertise.find((category) => category.id === "leadership");
    expect(leadership).toBeDefined();

    await user.click(screen.getByRole("tab", { name: leadership!.label }));

    expect(screen.getByText(leadership!.summary)).toBeInTheDocument();
    for (const item of leadership!.items) {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0);
    }
  });

  // Confirm that the theme toggle switches the UI from light to dark mode.
  it("switches between light and dark themes", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(container.firstElementChild).toHaveClass("app");
    expect(container.firstElementChild).not.toHaveClass("app--dark");

    await user.click(screen.getByRole("button", { name: /switch to dark theme/i }));

    expect(container.firstElementChild).toHaveClass("app--dark");
    expect(
      screen.getByRole("button", { name: /switch to light theme/i }),
    ).toBeInTheDocument();
  });

  // Check that navigation to the contact section adds a temporary highlight class.
  it("highlights a section after navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: /contact/i }));

    const contactSection = screen
      .getByRole("heading", { name: /global senior ic roles/i })
      .closest("article");

    expect(contactSection).not.toBeNull();
    await waitFor(() => expect(contactSection).toHaveClass("section-highlight"));
  });

  // Verify that all target roles and timeline items are rendered as accessible, interactive content.
  it("renders every target role and timeline entry as navigable content", () => {
    render(<App />);

    for (const role of profile.targetRoles) {
      expect(screen.getAllByText(role).length).toBeGreaterThan(0);
    }

    const timelineList = screen.getByRole("list", { name: /experience timeline/i });
    for (const entry of timeline) {
      const entryButton = within(timelineList).getByRole("button", {
        name: new RegExp(entry.role.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      });
      expect(entryButton).toBeInTheDocument();
    }
  });
});
