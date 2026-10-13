import { Button, PageIntro } from "@/components/ui";

export default function NotFound() {
  return (
    <PageIntro
      title="Page Not Found."
      lede={<p>This page may have moved. Our research is still here.</p>}
      cta={
        <div className="flex flex-wrap gap-x-4">
          <Button href="/">Go Home</Button>
          <Button href="/competition">Explore Our Research</Button>
        </div>
      }
    />
  );
}
