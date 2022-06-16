import { NodeHtmlMarkdown } from 'node-html-markdown';

describe('library: node-html-markdown', () => {
  test('called NodeHtmlMarkdown.translate is html string', () => {
    const head1 = NodeHtmlMarkdown.translate('<h1 id="abc">abc</h1>\n');
    expect(head1).toBe('# abc');
  });
});
