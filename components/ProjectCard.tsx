import type { Project } from "@/lib/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border border-text-dark/10 bg-white/30 p-5 backdrop-blur-md">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-text-dark">{project.title}</h3>
        <span className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          project.status === "active" ? "bg-green-600/15 text-green-700" : "bg-text-dark/10 text-text-dark-body"
        }`}>
          {project.status}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-text-dark-body">{project.description}</p>
      {project.body && <p className="mt-2 text-xs leading-relaxed text-text-dark-body/80">{project.body}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span key={t} className="rounded bg-text-dark/10 px-2 py-0.5 text-[10px] text-text-dark-body">{t}</span>
        ))}
      </div>
    </div>
  );
}
