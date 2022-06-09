import * as React from 'react';
import { render } from '@testing-library/react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';

describe('library: react-icons', () => {
  test('render BiBold', () => {
    const result = render(<BiBold size="20" />);
    expect(result).toMatchSnapshot();
  });

  test('render BiUnderline', () => {
    const result = render(<BiUnderline size="20" />);
    expect(result).toMatchSnapshot();
  });

  test('render BiItalic', () => {
    const result = render(<BiItalic size="20" />);
    expect(result).toMatchSnapshot();
  });

  test('render BiLink', () => {
    const result = render(<BiLink size="20" />);
    expect(result).toMatchSnapshot();
  });
});
