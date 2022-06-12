import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';
import useToolbar from './useToolbar';
import ToolButton from './ToolButton';

interface ToolbarProps {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
}

function Toolbar({ divRef }: ToolbarProps) {
  const toolbarRef = React.useRef<HTMLDivElement | null>(null);
  const { toolbarPosition, showToolbar } = useToolbar(divRef);

  return (
    <ToolbarWrapper toolbarRef={toolbarRef} showToolbar={showToolbar} toolbarPosition={toolbarPosition}>
      <ButtonWrapper>
        <ToolButton divRef={divRef} changeTagName="b" Icon={BiBold} />
        <ToolButton divRef={divRef} changeTagName="u" Icon={BiUnderline} />
        <ToolButton divRef={divRef} changeTagName="i" Icon={BiItalic} />
        <ToolButton divRef={divRef} changeTagName="a" Icon={BiLink} InputAttributeName="href" />
      </ButtonWrapper>
    </ToolbarWrapper>
  );
}

export default Toolbar;

type ToolbarWrapperProps = {
  showToolbar: boolean;
  toolbarPosition: [number, number];
  toolbarRef: React.MutableRefObject<HTMLDivElement | null>;
};

const ToolbarWrapper = styled.div`
  transition: opacity 0.2s, margin-top 0.2s;
  ${(props: ToolbarWrapperProps) => {
    if (props.showToolbar) {
      return css`
        opacity: 1;
        visibility: visible;
        margin-top: 10px;
      `;
    }
    return css`
      opacity: 0;
      visibility: hidden;
      margin-top: 0px;
    `;
  }}
  background-color: white;
  border-top: 2px black solid;
  border-left: 1px rgb(230, 230, 230) solid;
  border-right: 1px rgb(230, 230, 230) solid;
  position: absolute;
  left: ${(props: ToolbarWrapperProps) => (props.toolbarPosition ? `${props.toolbarPosition[0]}px` : null)};
  top: ${(props: ToolbarWrapperProps) => (props.toolbarPosition ? `${props.toolbarPosition[1]}px` : null)};
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ButtonWrapper = styled.div`
  background-color: white;
  border-bottom: 1px rgb(230, 230, 230) solid;
  display: flex;
  z-index: 1;
`;
