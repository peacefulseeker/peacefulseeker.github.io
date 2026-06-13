import { describe, it, expect } from "vitest";
import { contactHref } from "./contactHref";

describe("contactHref", () => {
  // Social handles must be rejected before the email check
  describe("social handles (leading @)", () => {
    it("returns null for a social handle with leading @", () => {
      expect(contactHref("@janedoe")).toBeNull();
    });

    it("returns null for a federated handle (@user@host)", () => {
      expect(contactHref("@janedoe@mastodon.social")).toBeNull();
    });
  });

  // TC-03-02: Email → mailto:
  describe("email addresses", () => {
    it("returns mailto: for a plain email address", () => {
      expect(contactHref("jane@example.com")).toBe("mailto:jane@example.com");
    });

    it("returns mailto: for an email with subdomain", () => {
      expect(contactHref("user@mail.company.org")).toBe(
        "mailto:user@mail.company.org",
      );
    });

    it("does not treat a URL containing @ as email", () => {
      // e.g. a URL with credentials — has ://, so treated as full URL
      expect(contactHref("https://user@example.com")).toBe(
        "https://user@example.com",
      );
    });
  });

  // TC-03-03: Full https/http URL → use as-is
  describe("full URLs", () => {
    it("returns the url unchanged for https:// prefix", () => {
      expect(contactHref("https://linkedin.com/in/jane")).toBe(
        "https://linkedin.com/in/jane",
      );
    });

    it("returns the url unchanged for http:// prefix", () => {
      expect(contactHref("http://example.com")).toBe("http://example.com");
    });

    it("returns the url unchanged for a deep https path", () => {
      expect(contactHref("https://github.com/janedoe/repo")).toBe(
        "https://github.com/janedoe/repo",
      );
    });
  });

  // TC-03-04: Bare domain → prepend https://
  describe("bare domains", () => {
    it("prepends https:// to a bare domain", () => {
      expect(contactHref("github.com/janedoe")).toBe(
        "https://github.com/janedoe",
      );
    });

    it("prepends https:// to a simple two-part domain", () => {
      expect(contactHref("example.com")).toBe("https://example.com");
    });

    it("prepends https:// to a domain with subdomain path", () => {
      expect(contactHref("linkedin.com/in/janedoe")).toBe(
        "https://linkedin.com/in/janedoe",
      );
    });

    it("prepends https:// to a mixed-case domain", () => {
      expect(contactHref("GitHub.com/janedoe")).toBe(
        "https://GitHub.com/janedoe",
      );
    });
  });

  // TC-03-05: Plain text → null
  describe("plain text values (no href)", () => {
    it("returns null for a city/state location", () => {
      expect(contactHref("San Francisco, CA")).toBeNull();
    });

    it("returns null for a phone number", () => {
      expect(contactHref("+1 (555) 000-0000")).toBeNull();
    });

    it("returns null for a plain word with no dot", () => {
      expect(contactHref("Remote")).toBeNull();
    });

    it("returns null for an empty string", () => {
      expect(contactHref("")).toBeNull();
    });
  });
});
