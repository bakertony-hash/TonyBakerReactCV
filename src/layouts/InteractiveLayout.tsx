import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Cpu,
  Download,
  ExternalLink,
  Github,
  Layers3,
  Mail,
  MapPin,
  Moon,
  Network,
  Phone,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  availability,
  education,
  expertise,
  impactHighlights,
  profile,
  timeline,
  type ExpertiseCategory,
  type TimelineEntry,
} from "../data/cv";
import LayoutSwitcher from "../components/LayoutSwitcher";
import type { LayoutId } from "./layoutPreference";

const navItems = [
  { href: "#overview", label: "Overview", icon: Sparkles },
  { href: "#impact", label: "Impact", icon: Rocket },
  { href: "#experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "#expertise", label: "Expertise", icon: Cpu },
  { href: "#contact", label: "Contact", icon: Mail },
];

const defaultTagIcons = [Cpu, Network, Layers3, ShieldCheck];
const tagIconMap: Record<string, any> = {
  AI: Cpu,
  Architecture: Network,
  Platform: Layers3,
  Enablement: ShieldCheck,
  Leadership: BriefcaseBusiness,
};

function InteractiveLayout({
  currentLayout,
  onLayoutChange,
}: {
  currentLayout: LayoutId;
  onLayoutChange: (layout: LayoutId) => void;
}) {
  const [activeTimelineId, setActiveTimelineId] = useState(timeline[0].id);
  const [activeExpertiseId, setActiveExpertiseId] = useState(expertise[0].id);
  const [isDark, setIsDark] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const highlightTimer = useRef<number | null>(null);
  const expertiseTabsRef = useRef<HTMLDivElement>(null);
  const hasExpertiseRendered = useRef(false);

  const activeTimeline = useMemo(
    () => timeline.find((entry) => entry.id === activeTimelineId) ?? timeline[0],
    [activeTimelineId],
  );

  const activeExpertise = useMemo(
    () => expertise.find((item) => item.id === activeExpertiseId) ?? expertise[0],
    [activeExpertiseId],
  );

  useEffect(() => {
    return () => {
      if (highlightTimer.current) {
        window.clearTimeout(highlightTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasExpertiseRendered.current) {
      hasExpertiseRendered.current = true;
      return;
    }

    if (typeof window.matchMedia !== "function") {
      return;
    }

    const isMobileExpertise = window.matchMedia("(max-width: 760px)").matches;
    if (!isMobileExpertise) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      expertiseTabsRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    });

    return () => {
      if (typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(animationFrame);
      } else {
        window.clearTimeout(animationFrame);
      }
    };
  }, [activeExpertiseId]);

  const triggerSectionHighlight = (sectionId: string) => {
    if (highlightTimer.current) {
      window.clearTimeout(highlightTimer.current);
    }

    setActiveHighlight(null);
    window.requestAnimationFrame(() => {
      setActiveHighlight(sectionId);
      highlightTimer.current = window.setTimeout(() => {
        setActiveHighlight(null);
        highlightTimer.current = null;
      }, 1400);
    });
  };

  return (
    <div className={isDark ? "app app--dark" : "app"}>
      <aside className="nav-rail" aria-label="Primary navigation">
        <a
          className="brand-mark"
          href="#overview"
          aria-label="Tony Baker overview"
          onClick={() => triggerSectionHighlight("overview")}
        >
          TB
        </a>
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="icon-button"
                onClick={() => triggerSectionHighlight(item.href.replace("#", ""))}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <LayoutSwitcher
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
          compact
        />
        <button
          type="button"
          className="icon-button theme-toggle"
          onClick={() => setIsDark((value) => !value)}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          <span>{isDark ? "Light" : "Dark"}</span>
        </button>
      </aside>

      <main className="page-shell">
        <section
          id="overview"
          className={activeHighlight === "overview" ? "hero-grid section-highlight" : "hero-grid"}
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">Interactive CV / React + TypeScript</p>
            <h1 id="hero-title">{profile.name}</h1>
            <p className="hero-title">{profile.title}</p>
            <p className="hero-summary">{profile.summary[0]}</p>
            <p className="hero-summary muted">{profile.summary[1]}</p>
            <div className="hero-actions" aria-label="Contact actions">
              <a className="primary-action" href={`mailto:${profile.email}`}>
                <Mail size={18} aria-hidden="true" />
                Start a conversation
              </a>
              <a
                className="secondary-action"
                href="/Tony_Baker_CV.pdf"
                download
                title="Download Tony Baker's CV as a PDF"
              >
                <Download size={18} aria-hidden="true" />
                Download CV
              </a>
            </div>
          </div>

          <aside className="signal-panel" aria-label="Profile signal panel">
            <div className="portrait-card">
              <img
                src="/tony-baker-headshot.png"
                alt="Tony Baker"
                className="profile-portrait"
              />
            </div>
            <div className="status-row">
              <span className="live-dot" aria-hidden="true" />
              Senior IC profile
            </div>
            <div className="location-row">
              <MapPin size={18} aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
            <div className="target-role-grid">
              {profile.targetRoles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
            <div className="search-card">
              <Search size={18} aria-hidden="true" />
              <span>Best matched for production AI, architecture, and platform modernisation.</span>
            </div>
          </aside>
        </section>

        <section
          id="impact"
          className={activeHighlight === "impact" ? "section-block section-highlight" : "section-block"}
          aria-labelledby="impact-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Recent Highlights</p>
            <h2 id="impact-title">Measurable engineering impact</h2>
          </div>
          <div className="impact-grid">
            {impactHighlights.map((item) => (
              <article key={item.label} className={`impact-card impact-card--${item.theme}`}>
                <p className="impact-metric">{item.metric}</p>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="experience"
          className={activeHighlight === "experience" ? "experience-layout section-highlight" : "experience-layout"}
          aria-labelledby="experience-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Interactive timeline</p>
            <h2 id="experience-title">Experience that bridges AI, architecture, and business execution</h2>
          </div>

          <div className="timeline-grid">
            <div className="timeline-list" role="list" aria-label="Experience timeline">
              {timeline.map((entry) => (
                <TimelineButton
                  key={entry.id}
                  entry={entry}
                  isActive={entry.id === activeTimelineId}
                  onSelect={() => setActiveTimelineId(entry.id)}
                />
              ))}
            </div>

            <article className="timeline-detail">
              <TimelineDetailContent entry={activeTimeline} />
            </article>
          </div>
        </section>

        <section
          id="expertise"
          className={activeHighlight === "expertise" ? "expertise-layout section-highlight" : "expertise-layout"}
          aria-labelledby="expertise-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Capability map</p>
            <h2 id="expertise-title">Engineering Capabilities</h2>
          </div>

          <div className="expertise-grid">
            <div
              ref={expertiseTabsRef}
              className="expertise-tabs"
              role="tablist"
              aria-label="Expertise categories"
            >
              {expertise.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={category.id === activeExpertiseId}
                  className={category.id === activeExpertiseId ? "expertise-tab active" : "expertise-tab"}
                  onClick={() => setActiveExpertiseId(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <ExpertisePanel category={activeExpertise} />
          </div>
        </section>

        <section className="closing-grid" aria-label="Education and availability">
          <article className="education-card">
            <p className="eyebrow">Education</p>
            <h2>{education.degree}</h2>
            <p>{education.field}</p>
            <div className="university-lockup">
              <img src="/waikato-logo.svg" alt="" aria-hidden="true" />
              <strong>{education.institution}</strong>
            </div>
            {Array.isArray(education.distinction) ? (
              <div>
                {education.distinction.map((line) => (
                  <span key={line} className="education-distinction">
                    {line}
                  </span>
                ))}
              </div>
            ) : (
              <span>{education.distinction}</span>
            )}
          </article>
          <article
            id="contact"
            className={activeHighlight === "contact" ? "contact-card section-highlight" : "contact-card"}
          >
            <p className="eyebrow">Availability</p>
            <h2>Global Senior IC roles</h2>
            <p>{availability}</p>
            <div className="contact-links">
              <a href={`mailto:${profile.email}`}>
                <Mail size={16} aria-hidden="true" />
                {profile.email}
              </a>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                <Phone size={16} aria-hidden="true" />
                {profile.phone}
              </a>
              <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer">
                <ExternalLink size={16} aria-hidden="true" />
                {profile.linkedin}
              </a>
            </div>
          </article>
        </section>

        <footer className="site-footer">
          <span>Built as an interactive React/TypeScript CV.</span>
          <a href="https://github.com/bakertony-hash/TonyBakerReactCV" target="_blank" rel="noreferrer">
            <Github size={16} aria-hidden="true" />
            GitHub repository
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </footer>
      </main>
    </div>
  );
}

function TimelineButton({
  entry,
  isActive,
  onSelect,
}: {
  entry: TimelineEntry;
  isActive: boolean;
  onSelect: () => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const hasRendered = useRef(false);

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }

    if (!isActive || typeof window.matchMedia !== "function") {
      return;
    }

    const isMobileTimeline = window.matchMedia("(max-width: 760px)").matches;
    if (!isMobileTimeline) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      itemRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    });

    return () => {
      if (typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(animationFrame);
      } else {
        window.clearTimeout(animationFrame);
      }
    };
  }, [isActive]);

  return (
    <div
      ref={itemRef}
      className={isActive ? "timeline-item active" : "timeline-item"}
      role="listitem"
    >
      <button
        type="button"
        className={isActive ? "timeline-button active" : "timeline-button"}
        onClick={onSelect}
        aria-pressed={isActive}
        aria-expanded={isActive}
        aria-controls={`timeline-mobile-detail-${entry.id}`}
      >
        <span className="timeline-dot" aria-hidden="true" />
        <span className="timeline-button-content">
          <strong>{entry.role}</strong>
          <span>{entry.company}</span>
          <small>{entry.period}</small>
        </span>
      </button>
      {isActive ? (
        <article
          id={`timeline-mobile-detail-${entry.id}`}
          className="timeline-mobile-detail"
          aria-label={`${entry.role} details`}
        >
          <TimelineDetailContent entry={entry} />
        </article>
      ) : null}
    </div>
  );
}

function TimelineDetailContent({ entry }: { entry: TimelineEntry }) {
  return (
    <>
      <div className="detail-header">
        <div>
          <p className="period">{entry.period}</p>
          <h3>{entry.role}</h3>
          <p className="company">{entry.company}</p>
        </div>
        <span>{entry.location}</span>
      </div>
      <p className="focus">{entry.focus}</p>
      <div className="tag-row">
        {entry.tags.map((tag, index) => {
          const Icon = tagIconMap[tag] ?? defaultTagIcons[index % defaultTagIcons.length];
          return (
            <span key={tag}>
              <Icon size={14} aria-hidden="true" />
              {tag}
            </span>
          );
        })}
      </div>
      <ul className="achievement-list">
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </>
  );
}

function ExpertisePanel({ category }: { category: ExpertiseCategory }) {
  return (
    <article className="expertise-panel">
      <div>
        <p className="eyebrow">Current filter</p>
        <h3>{category.label}</h3>
        <p>{category.summary}</p>
      </div>
      <div className="skill-cloud">
        {category.items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}

export default InteractiveLayout;
