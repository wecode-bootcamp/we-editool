import { marked } from 'marked';

describe('library: markded', () => {
  test('called marked.parse is html string', () => {
    const head1 = marked.parse('# abc');
    expect(head1).toBe('<h1 id="abc">abc</h1>\n');
  });
});
