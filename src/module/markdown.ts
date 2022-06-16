import { marked } from 'marked';
import { NodeHtmlMarkdown } from 'node-html-markdown';

export function markdownToHTML(markdown: string) {
  return marked.parse(markdown);
}

export function htmlToMarkdown(html: string) {
  return NodeHtmlMarkdown.translate(html);
}
