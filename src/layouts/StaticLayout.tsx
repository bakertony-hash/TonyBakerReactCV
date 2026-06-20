import {
  Download,
  ExternalLink,
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

const staticNav = [
  { label: "Experience", href: "#static-experience" },
  { label: "Capabilities", href: "#static-capabilities" },
  { label: "Education", href: "#static-education" },
];

function StaticLayout({
  currentLayout,
  onLayoutChange,
}: {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const phoneHref = profile.phone.replace(/\s/g, "");

  return (
    <div className="static-layout">
      <header className="static-header">
        <a className="static-wordmark" href="#static-overview">
          {profile.name}
        </a>
        <button
          className="static-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="static-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
          <span>Menu</span>
        </button>
        <nav
          id="static-navigation"
          className={`static-nav${menuOpen ? " static-nav--open" : ""}`}
          aria-label="static navigation"
        >
          {staticNav.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a className="static-nav-download" href="/Tony_Baker_CV.pdf" download>
            <Download aria-hidden="true" />
            Download CV
          </a>
          <a className="static-nav-contact" href={`mailto:${profile.email}`}>
            <Mail aria-hidden="true" />
            Contact
          </a>
        </nav>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </header>

      <main aria-label="Static CV">
        <section id="static-overview" className="static-hero">
          <div className="static-hero-copy">
            <p className="static-kicker">Distinguished Engineer</p>
            <h1>{profile.name}</h1>
            <p className="static-title">{profile.title}</p>
            <p className="static-location">
              <MapPin aria-hidden="true" />
              {profile.location}
            </p>
            <div className="static-target-roles" aria-label="Target roles">
              {profile.targetRoles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
            <div className="static-summary">
              {profile.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="static-hero-actions">
              <a href={`mailto:${profile.email}`}>
                <Mail aria-hidden="true" />
                Contact Tony
              </a>
              <a
                href="/Tony_Baker_CV.pdf"
                download
              >
                <Download aria-hidden="true" />
                Download CV
              </a>
            </div>
          </div>
          <figure className="static-portrait">
            <img src="/tony-baker-headshot.png" alt="Tony Baker" />
          </figure>
        </section>

        <section
          className="static-impact"
          aria-labelledby="static-impact-title"
        >
          <h2 id="static-impact-title" className="visually-hidden">
            Measured impact
          </h2>
          {impactHighlights.map((highlight) => (
            <article
              key={highlight.label}
              className={`static-impact-card static-impact-card--${highlight.theme}`}
            >
              <strong className="static-impact-metric">{highlight.metric}</strong>
              <h3>{highlight.label}</h3>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </section>

        <section
          id="static-experience"
          className="static-section"
          aria-labelledby="static-experience-title"
        >
          <header className="static-section-heading">
            <p>Career narrative</p>
            <h2 id="static-experience-title">Professional Experience</h2>
          </header>
          <div className="static-timeline">
            {timeline.map((entry, index) => (
              <article key={entry.id} className="static-role">
                <div className="static-role-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{entry.period}</p>
                  <p>{entry.location}</p>
                </div>
                <div className="static-role-body">
                  <p className="static-company">{entry.company}</p>
                  <h3>{entry.role}</h3>
                  <p className="static-focus">{entry.focus}</p>
                  <ul>
                    {entry.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div
                    className="static-tags"
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
          id="static-capabilities"
          className="static-section"
          aria-labelledby="static-capabilities-title"
        >
          <header className="static-section-heading">
            <p>Technical range</p>
            <h2 id="static-capabilities-title">Engineering Capabilities</h2>
          </header>
          <div className="static-capability-grid">
            {expertise.map((category) => (
              <article key={category.id}>
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
          id="static-education"
          className="static-section static-education"
          aria-labelledby="static-education-title"
        >
          <header className="static-section-heading">
            <p>Academic foundation</p>
            <h2 id="static-education-title">Education</h2>
          </header>
          <article>
            <img
              className="static-education-logo"
              src="/waikato-logo.svg"
              alt=""
            />
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

      <footer className="static-footer">
        <div>
          <strong>{profile.name}</strong>
          <p>{availability}</p>
        </div>
        <div className="static-footer-links">
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

export default StaticLayout;

