import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders trusted markdown (authored by the admin) using the site's
 * `prose-legal` typography. Used for blog posts and recipe write-ups.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-legal">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
