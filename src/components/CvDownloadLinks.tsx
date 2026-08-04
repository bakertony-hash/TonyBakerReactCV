import { Download } from "lucide-react";

export const CV_DOWNLOADS = [
  {
    id: "engineering",
    label: "Engineering CV",
    href: "/Tony_Baker_CV.pdf",
    title: "Download Tony Baker's engineering-focused CV as a PDF",
  },
  {
    id: "adviser",
    label: "AI Adviser CV",
    href: "/Tony_Baker_AI_Business_Adviser_CV.pdf",
    title: "Download Tony Baker's AI adviser CV as a PDF",
  },
] as const;

export type CvDownloadVariant =
  | "interactive"
  | "static-nav"
  | "static-hero"
  | "static-footer";

function CvDownloadLinks({
  variant,
  iconSize = 18,
  onNavigate,
}: {
  variant: CvDownloadVariant;
  iconSize?: number;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={`cv-download-links cv-download-links--${variant}`}
      aria-label="CV downloads"
    >
      {CV_DOWNLOADS.map(({ id, label, href, title }) => (
        <a
          key={id}
          className={`cv-download-link cv-download-link--${id}`}
          href={href}
          download
          title={title}
          onClick={onNavigate}
        >
          <Download size={iconSize} aria-hidden="true" />
          {label}
        </a>
      ))}
    </div>
  );
}

export default CvDownloadLinks;
