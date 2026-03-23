import Image from "next/image";
import type { TeamMember } from "@/lib/content";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/[0.1] p-5 text-center backdrop-blur-md">
      <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-white/[0.08]">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} width={80} height={80} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold g-muted">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold g-heading">{member.name}</h3>
      <p className="text-xs font-medium text-blue-light">{member.role}</p>
      {member.department && (
        <p className="mt-0.5 text-[10px] g-muted">{member.department}</p>
      )}
      {member.bio && (
        <p className="mt-2 text-xs leading-relaxed g-body">{member.bio}</p>
      )}
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[10px] text-blue-light hover:text-primary">
          LinkedIn →
        </a>
      )}
    </div>
  );
}
