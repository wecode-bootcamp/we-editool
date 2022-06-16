import * as React from 'react';
import { render } from '@testing-library/react';
import { WeEditor, WeEditorRef } from '../src';

describe('component: WeEditor', () => {
  test('WeEditor render', () => {
    const result = render(<WeEditor />);
    expect(result).toMatchSnapshot();
  });

  test('called getHTML is string value', () => {
    const ref = React.createRef<WeEditorRef>();
    render(<WeEditor ref={ref} />);
    expect(typeof ref.current?.getHTML()).toBe('string');
  });

  test('called getMarkdown is string value', () => {
    const ref = React.createRef<WeEditorRef>();
    render(<WeEditor ref={ref} />);
    expect(typeof ref.current?.getMarkdown()).toBe('string');
  });
});
