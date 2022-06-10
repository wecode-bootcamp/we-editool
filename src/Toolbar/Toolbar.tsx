import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';
import { changeSelectionTag } from '../common/function';
import useSelection from '../hook/useSelection';
import useToolbar from './useToolbar';

interface ToolbarProps {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
}

function Toolbar({ divRef }: ToolbarProps) {
  const toolbarRef = React.useRef<HTMLDivElement | null>(null);
  const { toolbarPosition, showToolbar } = useToolbar(divRef);

  return (
    <ToolbarWrapper toolbarRef={toolbarRef} showToolbar={showToolbar} toolbarPosition={toolbarPosition}>
      <ButtonWrapper>
        <ToolButton
          onClick={() => {
            changeSelectionTag(divRef, 'b');
          }}
        >
          <BiBold size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            changeSelectionTag(divRef, 'u');
          }}
        >
          <BiUnderline size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            changeSelectionTag(divRef, 'i');
          }}
        >
          <BiItalic size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            const url = prompt('URL을 입력하세요', '');
            if (!url) return;
            changeSelectionTag(divRef, 'a', [{ name: 'href', value: url }]);
          }}
        >
          <BiLink size="20" />
        </ToolButton>
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

const ToolButton = styled.button`
  padding: 10px 10px 6px 10px;
  box-sizing: border-box;
  vertical-align: center;
  border: 0px rgb(230, 230, 230) solid;
  color: #757575;
  background-color: rgba(255, 255, 255, 0);
  &:hover {
    color: rgb(95, 205, 196);
    cursor: pointer;
  }
`;

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
