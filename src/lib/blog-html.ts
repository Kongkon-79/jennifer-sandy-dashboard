import DOMPurify from "dompurify";

// DOMPurify needs a browser DOM. SSR must never emit the original untrusted HTML.
export function sanitizeBlogHtml(html: string): string {
  if (typeof window === "undefined") return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "form", "input", "button", "textarea", "select"],
    FORBID_ATTR: ["srcdoc"],
  });
}
