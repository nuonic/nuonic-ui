import { Renderer, type Tokens, marked } from 'marked';

const markdownRenderer = new Renderer();

markdownRenderer.html = ({ text }: Tokens.HTML | Tokens.Tag) => escapeHtml(text);
markdownRenderer.link = function ({ href, title, tokens }: Tokens.Link) {
  const text = this.parser.parseInline(tokens);

  if (!isSafeMarkdownUrl(href)) {
    return text;
  }

  const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
  return `<a href="${escapeHtml(href.trim())}"${titleAttribute}>${text}</a>`;
};

export function renderMarkdown(content: string) {
  return marked.parse(content, {
    async: false,
    breaks: false,
    gfm: true,
    renderer: markdownRenderer,
  });
}

export function markdownToPlainText(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```\w*\n?|```/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
    .replace(/(^|[^_])_([^_\n]+)_/g, '$1$2')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '');
}

export function isSafeMarkdownUrl(href: string) {
  const trimmedHref = href.trim();

  if (
    trimmedHref.startsWith('/') ||
    trimmedHref.startsWith('#') ||
    trimmedHref.startsWith('./') ||
    trimmedHref.startsWith('../')
  ) {
    return true;
  }

  try {
    const url = new URL(trimmedHref);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function isSafeImageUrl(url: string) {
  const trimmedUrl = url.trim();

  if (trimmedUrl.startsWith('/')) {
    return true;
  }

  try {
    return new URL(trimmedUrl).protocol === 'https:';
  } catch {
    return false;
  }
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return character;
    }
  });
}
