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
  window.location.hash = "";
});

// Top-level suite for the main application component and its interactive behavior.
describe("App", () => {
  it("switches to the Static layout and saves the preference", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Static layout" }));

    expect(screen.getByRole("main", { name: "Static CV" })).toBeInTheDocument();
    const staticChoice = screen.getByRole("button", {
      name: "Static layout",
    });
    await waitFor(() => expect(staticChoice).toHaveFocus());
    expect(staticChoice).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe("static");
  });

  it("restores a saved Static layout preference", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");

    render(<App />);

    expect(screen.getByRole("main", { name: "Static CV" })).toBeInTheDocument();
    const staticChoice = screen.getByRole("button", {
      name: "Static layout",
    });
    expect(staticChoice).toHaveAttribute("aria-pressed", "true");
    expect(staticChoice).not.toHaveFocus();
  });

  it("renders the complete CV data in the Static layout", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");

    const { container } = render(<App />);

    const profileHeading = screen.getByRole("heading", {
      level: 1,
      name: profile.name,
    });
    const hero = profileHeading.closest("section");
    expect(hero).not.toBeNull();
    const heroContent = within(hero as HTMLElement);
    expect(heroContent.getByText(profile.title)).toBeInTheDocument();
    expect(heroContent.getByText(profile.location)).toBeInTheDocument();
    for (const paragraph of profile.summary) {
      expect(heroContent.getByText(paragraph)).toBeInTheDocument();
    }
    const targetRoles = within(screen.getByLabelText("Target roles"));
    for (const role of profile.targetRoles) {
      expect(targetRoles.getByText(role)).toBeInTheDocument();
    }
    const footer = within(container.querySelector("footer") as HTMLElement);
    expect(footer.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(footer.getByRole("link", { name: profile.phone })).toHaveAttribute(
      "href",
      `tel:${profile.phone.replace(/\s/g, "")}`,
    );
    expect(footer.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      `https://${profile.linkedin}`,
    );
    expect(footer.getByText(availability)).toBeInTheDocument();

    for (const highlight of impactHighlights) {
      const impactArticle = screen.getByText(highlight.metric).closest("article");
      expect(impactArticle).not.toBeNull();
      const impactContent = within(impactArticle as HTMLElement);
      expect(impactContent.getByText(highlight.metric)).toBeInTheDocument();
      expect(
        impactContent.getByRole("heading", { name: highlight.label }),
      ).toBeInTheDocument();
      expect(impactContent.getByText(highlight.detail)).toBeInTheDocument();
    }

    for (const entry of timeline) {
      const roleHeading = screen.getByRole("heading", { name: entry.role });
      const roleArticle = roleHeading.closest("article");
      expect(roleArticle).not.toBeNull();
      const roleContent = within(roleArticle as HTMLElement);
      expect(roleContent.getByText(entry.company)).toBeInTheDocument();
      expect(roleContent.getByText(entry.period)).toBeInTheDocument();
      expect(roleContent.getByText(entry.location)).toBeInTheDocument();
      expect(roleContent.getByText(entry.focus)).toBeInTheDocument();
      for (const tag of entry.tags) {
        expect(roleContent.getByText(tag)).toBeInTheDocument();
      }
      for (const bullet of entry.bullets) {
        expect(roleContent.getByText(bullet)).toBeInTheDocument();
      }
    }

    for (const category of expertise) {
      const categoryHeading = screen.getByRole("heading", {
        name: category.label,
      });
      const categoryArticle = categoryHeading.closest("article");
      expect(categoryArticle).not.toBeNull();
      const categoryContent = within(categoryArticle as HTMLElement);
      expect(categoryContent.getByText(category.summary)).toBeInTheDocument();
      for (const item of category.items) {
        expect(categoryContent.getByText(item)).toBeInTheDocument();
      }
    }

    const educationHeading = screen.getByRole("heading", {
      name: education.institution,
    });
    const educationArticle = educationHeading.closest("article");
    expect(educationArticle).not.toBeNull();
    const educationLogo = educationArticle?.querySelector(
      'img[src="/waikato-logo.svg"]',
    );
    expect(educationLogo).toHaveAttribute("alt", "");
    const educationContent = within(educationArticle as HTMLElement);
    expect(educationContent.getByText(education.degree)).toBeInTheDocument();
    expect(educationContent.getByText(education.field)).toBeInTheDocument();
    for (const distinction of education.distinction) {
      expect(educationContent.getByText(distinction)).toBeInTheDocument();
    }
    for (const downloadLink of screen.getAllByRole("link", {
      name: "Download CV",
    })) {
      expect(downloadLink).toHaveAttribute("download");
    }
  });

  it("does not render fabricated Stitch facts", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");

    const { container } = render(<App />);

    const renderedText = container.textContent?.replace(/\s+/g, " ") ?? "";

    expect(screen.queryByText(`$${"40M"}`)).not.toBeInTheDocument();
    expect(renderedText).not.toContain(["200", "+"].join(""));
    expect(renderedText).not.toContain(["99", ".99", "%"].join(""));
    expect(
      screen.queryByText(new RegExp(["VP", "of", "Infrastructure"].join(" "), "i")),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(new RegExp(["Staff", "Engineer"].join(" "), "i")),
    ).not.toBeInTheDocument();
  });

  it("matches the Static layout design structure", () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");

    const { container } = render(<App />);

    const nav = container.querySelector("#static-navigation");
    expect(nav).toHaveClass("static-nav");
    expect(nav?.querySelector(".static-nav-download")).toHaveAttribute("download");
    expect(nav?.querySelector(".static-nav-contact")).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(
      container.querySelector(".static-menu-button > svg + span"),
    ).toHaveTextContent("Menu");

    expect(container.querySelector(".static-hero-copy .static-summary")).not.toBeNull();
    expect(container.querySelector("figure.static-portrait img")).toHaveAttribute(
      "src",
      "/tony-baker-headshot.png",
    );
    expect(
      within(container.querySelector(".static-hero-actions") as HTMLElement).getByRole(
        "link",
        { name: "Download CV" },
      ),
    ).toHaveAttribute("download");

    const impact = container.querySelector("section.static-impact");
    expect(impact).toHaveAttribute("aria-labelledby", "static-impact-title");
    expect(impact?.querySelector("#static-impact-title")).toHaveTextContent(
      "Measured impact",
    );
    expect(impact?.querySelectorAll("article strong")).toHaveLength(impactHighlights.length);

    const experience = container.querySelector("#static-experience");
    expect(experience).toHaveClass("static-section");
    expect(experience).toHaveAttribute("aria-labelledby", "static-experience-title");
    expect(experience?.querySelector(".static-section-heading p")).toHaveTextContent(
      "Career narrative",
    );
    expect(experience?.querySelector(".static-timeline")).not.toBeNull();
    expect(experience?.querySelectorAll(".static-role-body")).toHaveLength(timeline.length);
    for (const [index, metadata] of Array.from(
      experience?.querySelectorAll(".static-role-meta") ?? [],
    ).entries()) {
      expect(metadata.firstElementChild).toMatchObject({ tagName: "SPAN" });
      expect(metadata.firstElementChild).toHaveTextContent(
        String(index + 1).padStart(2, "0"),
      );
    }

    const capabilities = container.querySelector("#static-capabilities");
    expect(capabilities).toHaveClass("static-section");
    expect(capabilities).toHaveAttribute(
      "aria-labelledby",
      "static-capabilities-title",
    );
    expect(capabilities?.querySelector(".static-section-heading p")).toHaveTextContent(
      "Technical range",
    );
    expect(capabilities?.querySelector(".static-capability-grid")).not.toBeNull();

    const educationSection = container.querySelector("#static-education");
    expect(educationSection).toHaveClass("static-section", "static-education");
    expect(educationSection).toHaveAttribute(
      "aria-labelledby",
      "static-education-title",
    );
    expect(educationSection?.querySelector(".static-section-heading p")).toHaveTextContent(
      "Academic foundation",
    );

    expect(container.querySelector(".static-footer > div:first-child strong")).toHaveTextContent(
      profile.name,
    );
    const footerLinks = container.querySelector(".static-footer-links");
    expect(within(footerLinks as HTMLElement).getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      `https://${profile.linkedin}`,
    );
  });

  it("switches from a saved Static layout to the interactive layout", async () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Interactive layout" }));

    expect(screen.getByRole("complementary", { name: "Primary navigation" })).toBeInTheDocument();
    const interactiveChoice = screen.getByRole("button", {
      name: "Interactive layout",
    });
    await waitFor(() => expect(interactiveChoice).toHaveFocus());
    expect(interactiveChoice).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(LAYOUT_STORAGE_KEY)).toBe("interactive");
  });

  it("closes the static menu after navigating to Experience", async () => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, "static");
    const user = userEvent.setup();
    render(<App />);

    const menuButton = screen.getByRole("button", { name: "Menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("link", { name: "Experience" }));
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(window.location.hash).toBe("#static-experience");
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

