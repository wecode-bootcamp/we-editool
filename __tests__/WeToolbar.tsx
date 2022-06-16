import * as React from 'react';
import { render } from '@testing-library/react';
import { WeToolbar } from '../src';

describe('component: WeToolbar', () => {
  test('WeToolbar render', () => {
    const ref = React.createRef<HTMLDivElement>();
    const result = render(<WeToolbar editorRef={ref} />);
    expect(result).toMatchSnapshot();
  });
});
