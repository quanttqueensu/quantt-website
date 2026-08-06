import { describe, it, expect } from "vitest";
import {
  getSiteConfig,
  getEvents,
  getPartners,
  getTeamMembers,
  getTeamYears,
  getProjects,
  getEducationChapters,
} from "@/lib/content";

describe("content loading", () => {
  it("loads site config", () => {
    const config = getSiteConfig();
    expect(config).toHaveProperty("recruiting");
    expect(config).toHaveProperty("copyright");
    expect(typeof config.recruiting).toBe("boolean");
  });

  it("loads events as array", () => {
    const events = getEvents();
    expect(Array.isArray(events)).toBe(true);
    if (events.length > 0) {
      expect(events[0]).toHaveProperty("title");
      expect(events[0]).toHaveProperty("date");
    }
  });

  it("loads partners with current and past", () => {
    const partners = getPartners();
    expect(partners).toHaveProperty("current");
    expect(partners).toHaveProperty("past");
    expect(Array.isArray(partners.current)).toBe(true);
  });

  it("loads team members sorted by order", () => {
    const members = getTeamMembers();
    expect(Array.isArray(members)).toBe(true);
    if (members.length > 1) {
      expect(members[0].order).toBeLessThanOrEqual(members[1].order);
    }
  });

  it("loads research papers keyed by project team", () => {
    const year = getTeamYears().find((y) => y.config.year === "2025-2026");
    expect(year).toBeDefined();
    const papers = year!.config.researchPapers ?? {};
    for (const team of year!.config.projectTeams ?? []) {
      expect(papers[team]).toMatch(/^\/papers\/.+\.pdf$/);
    }
  });

  it("loads projects sorted by order with slugs", () => {
    const projects = getProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBe(8);
    for (const project of projects) {
      expect(project).toHaveProperty("title");
      expect(project).toHaveProperty("slug");
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project).toHaveProperty("description");
      expect(project.status).toMatch(/^(active|completed)$/);
    }
    if (projects.length > 1) {
      expect(projects[0].order).toBeLessThanOrEqual(projects[1].order);
    }
  });

  it("loads education chapters sorted by chapter number", () => {
    const chapters = getEducationChapters();
    expect(Array.isArray(chapters)).toBe(true);
    if (chapters.length > 1) {
      expect(chapters[0].chapter).toBeLessThanOrEqual(chapters[1].chapter);
    }
  });
});
