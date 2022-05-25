import * as React from 'react';
import { act, renderHook } from '@testing-library/react';

describe('library: react', () => {
  test('react defined', () => {
    expect(React).toBeDefined();
  });

  test('useState has state and setState', () => {
    const { result } = renderHook(() => React.useState(0));
    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](1);
    });
    expect(result.current[0]).toBe(1);
  });

  test('useEffect called', () => {
    renderHook(() => React.useEffect(() => {}, []));
  });

  test('useImperativeHandle get ref object', () => {
    const { result } = renderHook(() => {
      const ref = React.createRef<{ foo: VoidFunction; bar: string }>();
      React.useImperativeHandle(ref, () => ({
        foo: () => {},
        bar: 'test',
      }));

      return ref;
    });
    expect(result.current.current?.foo).toBeInstanceOf(Function);
    expect(result.current.current?.bar).toBe('test');
  });
});
