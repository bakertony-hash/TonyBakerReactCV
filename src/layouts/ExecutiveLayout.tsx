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
          className={`executive-nav${menuOpen ? " executive-nav--open" : ""}`}
          aria-label="Executive navigation"
        >
          {executiveNav.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a className="executive-nav-download" href="/Tony_Baker_CV.pdf" download>
            <Download aria-hidden="true" />
            Download CV
          </a>
          <a className="executive-nav-contact" href={`mailto:${profile.email}`}>
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
          <div className="executive-hero-copy">
            <p className="executive-kicker">Distinguished Engineer</p>
            <h1>{profile.name}</h1>
            <p className="executive-title">{profile.title}</p>
            <p className="executive-location">
              <MapPin aria-hidden="true" />
              {profile.location}
            </p>
            <div className="executive-summary">
              {profile.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
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
          <figure className="executive-portrait">
            <img src="/tony-baker-headshot.png" alt="Tony Baker" />
          </figure>
        </section>

        <section
          className="executive-impact"
          aria-labelledby="executive-impact-title"
        >
          <h2 id="executive-impact-title" className="visually-hidden">
            Measured impact
          </h2>
          {impactHighlights.map((highlight) => (
            <article
              key={highlight.label}
              className={`executive-impact-card executive-impact-card--${highlight.theme}`}
            >
              <strong className="executive-impact-metric">{highlight.metric}</strong>
              <h3>{highlight.label}</h3>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </section>

        <section
          id="executive-experience"
          className="executive-section"
          aria-labelledby="executive-experience-title"
        >
          <header className="executive-section-heading">
            <p>Career narrative</p>
            <h2 id="executive-experience-title">Professional Experience</h2>
          </header>
          <div className="executive-timeline">
            {timeline.map((entry, index) => (
              <article key={entry.role} className="executive-role">
                <p className="executive-role-sequence">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="executive-role-meta">
                  <p>{entry.period}</p>
                  <p>{entry.location}</p>
                </div>
                <div className="executive-role-body">
                  <p className="executive-company">{entry.company}</p>
                  <h3>{entry.role}</h3>
                  <p className="executive-focus">{entry.focus}</p>
                  <ul>
                    {entry.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div
                    className="executive-tags"
                    aria-label={`${entry.role} capabilities`}
                  >
                    {entry.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="executive-capabilities"
          className="executive-section"
          aria-labelledby="executive-capabilities-title"
        >
          <header className="executive-section-heading">
            <p>Technical range</p>
            <h2 id="executive-capabilities-title">Executive Capabilities</h2>
          </header>
          <div className="executive-capability-grid">
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
          </div>
        </section>

        <section
          id="executive-education"
          className="executive-section executive-education"
          aria-labelledby="executive-education-title"
        >
          <header className="executive-section-heading">
            <p>Academic foundation</p>
            <h2 id="executive-education-title">Education</h2>
          </header>
          <article>
            <GraduationCap aria-hidden="true" />
            <div>
              <h3>{education.institution}</h3>
              <p>{education.degree}</p>
              <p>{education.field}</p>
              <ul>
                {education.distinction.map((distinction) => (
                  <li key={distinction}>{distinction}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      </main>

      <footer className="executive-footer">
        <div>
          <strong>{profile.name}</strong>
          <p>{availability}</p>
        </div>
        <div className="executive-footer-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={`tel:${phoneHref}`}>{profile.phone}</a>
          <a
            href={`https://${profile.linkedin}`}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <ExternalLink aria-hidden="true" />
          </a>
          <a href="/Tony_Baker_CV.pdf" download>
            <Download aria-hidden="true" />
            Download portfolio CV
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ExecutiveLayout;
