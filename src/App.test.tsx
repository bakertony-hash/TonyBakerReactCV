import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import {
  availability,
  education,
  expertise,
  impactHighlights,
  profile,
  timeline,
} from "./data/cv";
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

  it("renders the complete CV data in the Executive layout", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");

    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: profile.name }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(profile.title).length).toBeGreaterThan(0);
    expect(screen.getAllByText(profile.location).length).toBeGreaterThan(0);
    for (const paragraph of profile.summary) {
      expect(screen.getAllByText(paragraph).length).toBeGreaterThan(0);
    }
    for (const role of profile.targetRoles) {
      expect(screen.getAllByText(role).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole("link", { name: profile.phone })).toHaveAttribute(
      "href",
      `tel:${profile.phone.replace(/\s/g, "")}`,
    );
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      `https://${profile.linkedin}`,
    );
    expect(screen.getAllByText(availability).length).toBeGreaterThan(0);

    for (const highlight of impactHighlights) {
      expect(screen.getAllByText(highlight.metric).length).toBeGreaterThan(0);
      expect(screen.getAllByText(highlight.label).length).toBeGreaterThan(0);
      expect(screen.getAllByText(highlight.detail).length).toBeGreaterThan(0);
    }

    for (const entry of timeline) {
      expect(
        screen.getByRole("heading", { name: entry.role }),
      ).toBeInTheDocument();
      expect(screen.getAllByText(entry.company).length).toBeGreaterThan(0);
      expect(screen.getAllByText(entry.period).length).toBeGreaterThan(0);
      expect(screen.getAllByText(entry.location).length).toBeGreaterThan(0);
      expect(screen.getAllByText(entry.focus).length).toBeGreaterThan(0);
      for (const tag of entry.tags) {
        expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
      }
      for (const bullet of entry.bullets) {
        expect(screen.getAllByText(bullet).length).toBeGreaterThan(0);
      }
    }

    for (const category of expertise) {
      expect(
        screen.getByRole("heading", { name: category.label }),
      ).toBeInTheDocument();
      expect(screen.getAllByText(category.summary).length).toBeGreaterThan(0);
      for (const item of category.items) {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      }
    }

    expect(
      screen.getByRole("heading", { name: education.institution }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(education.degree).length).toBeGreaterThan(0);
    expect(screen.getAllByText(education.field).length).toBeGreaterThan(0);
    for (const distinction of education.distinction) {
      expect(screen.getAllByText(distinction).length).toBeGreaterThan(0);
    }
    for (const downloadLink of screen.getAllByRole("link", {
      name: "Download CV",
    })) {
      expect(downloadLink).toHaveAttribute("download");
    }
  });

  it("does not render fabricated Stitch facts", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");

    render(<App />);

    expect(screen.queryByText("$40M")).not.toBeInTheDocument();
    expect(screen.queryByText(/VP of Infrastructure/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Staff Engineer/i)).not.toBeInTheDocument();
  });

  it("matches the Executive layout design structure", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "executive");

    const { container } = render(<App />);

    const nav = container.querySelector("#executive-navigation");
    expect(nav).toHaveClass("executive-nav");
    expect(nav?.querySelector(".executive-nav-download")).toHaveAttribute("download");
    expect(nav?.querySelector(".executive-nav-contact")).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(
      container.querySelector(".executive-menu-button > svg + span"),
    ).toHaveTextContent("Menu");

    expect(container.querySelector(".executive-hero-copy .executive-summary")).not.toBeNull();
    expect(container.querySelector("figure.executive-portrait img")).toHaveAttribute(
      "src",
      "/tony-baker-headshot.png",
    );
    expect(
      within(container.querySelector(".executive-hero-actions") as HTMLElement).getByRole(
        "link",
        { name: "Download CV" },
      ),
    ).toHaveAttribute("download");

    const impact = container.querySelector("section.executive-impact");
    expect(impact).toHaveAttribute("aria-labelledby", "executive-impact-title");
    expect(impact?.querySelector("#executive-impact-title")).toHaveTextContent(
      "Measured impact",
    );
    expect(impact?.querySelectorAll("article strong")).toHaveLength(impactHighlights.length);

    const experience = container.querySelector("#executive-experience");
    expect(experience).toHaveClass("executive-section");
    expect(experience).toHaveAttribute("aria-labelledby", "executive-experience-title");
    expect(experience?.querySelector(".executive-section-heading p")).toHaveTextContent(
      "Career narrative",
    );
    expect(experience?.querySelector(".executive-timeline")).not.toBeNull();
    expect(experience?.querySelectorAll(".executive-role-body")).toHaveLength(timeline.length);
    for (const [index, metadata] of Array.from(
      experience?.querySelectorAll(".executive-role-meta") ?? [],
    ).entries()) {
      expect(metadata.firstElementChild).toMatchObject({ tagName: "SPAN" });
      expect(metadata.firstElementChild).toHaveTextContent(
        String(index + 1).padStart(2, "0"),
      );
    }

    const capabilities = container.querySelector("#executive-capabilities");
    expect(capabilities).toHaveClass("executive-section");
    expect(capabilities).toHaveAttribute(
      "aria-labelledby",
      "executive-capabilities-title",
    );
    expect(capabilities?.querySelector(".executive-section-heading p")).toHaveTextContent(
      "Technical range",
    );
    expect(capabilities?.querySelector(".executive-capability-grid")).not.toBeNull();

    const educationSection = container.querySelector("#executive-education");
    expect(educationSection).toHaveClass("executive-section", "executive-education");
    expect(educationSection).toHaveAttribute(
      "aria-labelledby",
      "executive-education-title",
    );
    expect(educationSection?.querySelector(".executive-section-heading p")).toHaveTextContent(
      "Academic foundation",
    );

    expect(container.querySelector(".executive-footer > div:first-child strong")).toHaveTextContent(
      profile.name,
    );
    const footerLinks = container.querySelector(".executive-footer-links");
    expect(within(footerLinks as HTMLElement).getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      `https://${profile.linkedin}`,
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
