import { CopyButton } from './copy-button';
import { ImageStrip } from './image-strip';
import { markdownToPlainText, renderMarkdown } from './markdown';
import type { RagChatImage, RagChatSource, UiMessage } from './types';

type MessageRowProps = {
  message: UiMessage;
  resolveImageUrl?: (url: string) => string;
};

export function MessageRow({ message, resolveImageUrl }: MessageRowProps) {
  if (message.role === 'user') {
    return (
      <div className="group flex justify-end">
        <div className="flex max-w-[85%] flex-col items-end gap-1">
          <div className="rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm leading-5 text-white shadow-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <CopyButton text={message.content} ariaLabel="Copy question" />
        </div>
      </div>
    );
  }

  return (
    <AssistantMessage
      content={message.content}
      sources={message.sources}
      images={message.images}
      resolveImageUrl={resolveImageUrl}
    />
  );
}

function AssistantMessage({
  content,
  sources,
  images,
  resolveImageUrl,
}: {
  content: string;
  sources?: RagChatSource[];
  images?: RagChatImage[];
  resolveImageUrl?: (url: string) => string;
}) {
  const contentHtml = renderMarkdown(content);

  return (
    <div className="group text-sm leading-relaxed text-slate-900 dark:text-slate-100">
      <div
        className="space-y-2 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-slate-800 [&_code]:text-xs [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-slate-100 [&_pre]:p-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-100 dark:[&_pre]:bg-slate-800"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      {images && images.length > 0 && <ImageStrip images={images} resolveImageUrl={resolveImageUrl} />}
      {sources && sources.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-xs dark:border-slate-700">
          {sources.map((source) => (
            <li key={`${source.title}-${source.url}`}>
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {source.title}
                </a>
              ) : (
                <span className="font-medium">{source.title}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-1">
        <CopyButton
          text={markdownToPlainText(content)}
          html={typeof contentHtml === 'string' ? contentHtml : undefined}
          ariaLabel="Copy response"
        />
      </div>
    </div>
  );
}
