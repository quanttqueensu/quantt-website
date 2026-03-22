import type { Project } from "@/lib/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur-md">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-white">{project.title}</h3>
        <span className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          project.status === "active" ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/50"
        }`}>
          {project.status}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-white/60">{project.description}</p>
      {project.body && <p className="mt-2 text-xs leading-relaxed text-white/50">{project.body}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/60">{t}</span>
        ))}
      </div>
    </div>
  );
}
