import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const contentDir = path.join(process.cwd(), "content");

export interface SiteConfig {
  recruiting: boolean;
  recruitingDetails?: string;
  recruitingUrl?: string;
  copyright: string;
}

export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  url?: string;
}

export interface Partner {
  name: string;
  logo: string;
  description: string;
}

export interface PartnersData {
  current: Partner[];
  past: Partner[];
}

export interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  order: number;
  bio: string;
  linkedin?: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  status: "active" | "completed";
  order: number;
  body?: string;
}

export interface EducationChapter {
  title: string;
  chapter: number;
  body: string;
}

function readYaml<T>(filename: string): T {
  const filePath = path.join(contentDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return yaml.load(raw) as T;
}

function readMdDir<T>(dir: string): (T & { body: string })[] {
  const dirPath = path.join(contentDir, dir);
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dirPath, file), "utf-8");
    const { data, content } = matter(raw);
    return { ...(data as T), body: content.trim() };
  });
}

export function getSiteConfig(): SiteConfig {
  return readYaml<SiteConfig>("config.yml");
}

export function getEvents(): Event[] {
  const events = readYaml<Event[] | null>("events.yml");
  return events ?? [];
}

export function getPartners(): PartnersData {
  return readYaml<PartnersData>("partners.yml");
}

export function getTeamMembers(): TeamMember[] {
  return readMdDir<TeamMember>("team").sort((a, b) => a.order - b.order);
}

export function getProjects(): Project[] {
  return readMdDir<Project>("projects").sort((a, b) => a.order - b.order);
}

export function getEducationChapters(): EducationChapter[] {
  return readMdDir<EducationChapter>("education").sort(
    (a, b) => a.chapter - b.chapter
  );
}
