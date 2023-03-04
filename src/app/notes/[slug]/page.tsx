import NoteView from "@/components/NoteView";
import { getNoteBySlug } from "@/lib/server/notes";
import { RequestContext } from "@/lib/types/context";
import { wait } from "@/lib/utils/wait";
import { Metadata } from "next";

export async function generateMetadata(
  ctx: RequestContext<{ slug: string }>
): Promise<Metadata> {
  const slug = ctx.params.slug;
  const note = await getNoteBySlug(slug);

  return {
    title: `NoteVine | ${note.title}`,
    description: note.content == null ? undefined : note.content,
  };
}

type Params = { slug: string };

export default async function NotePage(ctx: RequestContext<Params>) {
  await wait(3000);
  const slug = ctx.params.slug;
  const note = await getNoteBySlug(slug);

  return <NoteView note={note} />;
}
