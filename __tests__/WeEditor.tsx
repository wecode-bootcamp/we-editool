import * as React from 'react';
import { render } from '@testing-library/react';
import { WeEditor, WeEditorRef } from '../src';

describe('component: WeEditor', () => {
  test('WeEditor render', () => {
    render(<WeEditor />);
  });

  test('called getHTMLString has value', () => {
    const ref = React.createRef<WeEditorRef>();
    render(<WeEditor ref={ref} />);

    expect(ref.current?.getHTMLState()).toBe('');
  });
});
