import {
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
} from "lucide-react";
import { useState } from "react";
import LayoutSwitcher from "../components/LayoutSwitcher";
import {
  availability,
  education,
  expertise,
  impactHighlights,
  profile,
  timeline,
} from "../data/cv";
import type { LayoutId } from "./layoutPreference";

const executiveNav = [
  { label: "Experience", href: "#executive-experience" },
  { label: "Capabilities", href: "#executive-capabilities" },
  { label: "Education", href: "#executive-education" },
];

function ExecutiveLayout({
  currentLayout,
  onLayoutChange,
}: {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const phoneHref = profile.phone.replace(/\s/g, "");

  return (
    <div className="executive-layout">
      <header className="executive-header">
        <a className="executive-wordmark" href="#executive-overview">
          {profile.name}
        </a>
        <button
          className="executive-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="executive-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
          Menu
        </button>
        <nav
          id="executive-navigation"
          className={`executive-navigation${menuOpen ? " executive-navigation--open" : ""}`}
          aria-label="Executive navigation"
        >
          {executiveNav.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a href="/Tony_Baker_CV.pdf" download>
            <Download aria-hidden="true" />
            Download CV
          </a>
          <a href={`mailto:${profile.email}`}>
            <Mail aria-hidden="true" />
            Contact
          </a>
        </nav>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </header>

      <main aria-label="Executive CV">
        <section id="executive-overview" className="executive-hero">
          <div className="executive-hero-content">
            <p className="executive-kicker">Distinguished Engineer</p>
            <h1>{profile.name}</h1>
            <p className="executive-title">{profile.title}</p>
            <p className="executive-location">
              <MapPin aria-hidden="true" />
              {profile.location}
            </p>
            {profile.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="executive-hero-actions">
              <a href={`mailto:${profile.email}`}>
                <Mail aria-hidden="true" />
                Contact Tony
              </a>
              <a
                href="/Tony_Baker_CV.pdf"
                download
                aria-label="Download portfolio CV"
              >
                <Download aria-hidden="true" />
                Download CV
              </a>
            </div>
          </div>
          <img src="/tony-baker-headshot.png" alt="Tony Baker" />
        </section>

        <section className="executive-impact">
          <h2 className="visually-hidden">Career impact</h2>
          {impactHighlights.map((highlight) => (
            <article
              key={highlight.label}
              className={`executive-impact-card executive-impact-card--${highlight.theme}`}
            >
              <p className="executive-impact-metric">{highlight.metric}</p>
              <h3>{highlight.label}</h3>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </section>

        <section id="executive-experience" className="executive-experience">
          <h2>Professional Experience</h2>
          {timeline.map((entry, index) => (
            <article key={entry.role} className="executive-role">
              <p className="executive-role-sequence">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="executive-role-meta">
                <p>{entry.period}</p>
                <p>{entry.location}</p>
                <p>{entry.company}</p>
              </div>
              <h3>{entry.role}</h3>
              <p>{entry.focus}</p>
              <ul>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <ul
                className="executive-role-tags"
                aria-label={`${entry.role} capabilities`}
              >
                {entry.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="executive-capabilities" className="executive-capabilities">
          <h2>Executive Capabilities</h2>
          {expertise.map((category) => (
            <article key={category.label}>
              <h3>{category.label}</h3>
              <p>{category.summary}</p>
              <ul>
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="executive-education" className="executive-education">
          <h2>Education</h2>
          <article>
            <GraduationCap aria-hidden="true" />
            <h3>{education.institution}</h3>
            <p>{education.degree}</p>
            <p>{education.field}</p>
            <ul>
              {education.distinction.map((distinction) => (
                <li key={distinction}>{distinction}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>

      <footer className="executive-footer">
        <p>{profile.name}</p>
        <p>{availability}</p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={`tel:${phoneHref}`}>{profile.phone}</a>
        <a
          href={`https://${profile.linkedin}`}
          target="_blank"
          rel="noreferrer"
        >
          {profile.linkedin}
          <ExternalLink aria-hidden="true" />
        </a>
        <a href="/Tony_Baker_CV.pdf" download>
          <Download aria-hidden="true" />
          Download portfolio CV
        </a>
      </footer>
    </div>
  );
}

export default ExecutiveLayout;
