import styled from '@emotion/styled';
import { css } from '@emotion/react';

describe('library: emotion', () => {
  test('css template test', () => {
    const cssTemplate = css`
      display: flex;
    `;
    expect(cssTemplate).toMatchSnapshot();
  });

  test(`styled test`, () => {
    const StyledDiv = styled.div`
      display: flex;
    `;
    expect(StyledDiv).toMatchSnapshot();
  });
});
