import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';
import { ToolbarPostion } from '../common/type';
import { setTag } from '../common/function';
import useSelection from '../hook/useSelection';

interface ToolbarProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

function Toolbar({ containerRef }: ToolbarProps) {
  const [toolbarPosition, setToolbarPosition] = React.useState<ToolbarPostion>([0, 0]);
  const [showToolbar, setShowToolbar] = React.useState<boolean>(false);
  const toolbarRef = React.useRef<HTMLDivElement | null>(null);
  const { range, isSelectRange } = useSelection();

  React.useEffect(() => {
    if (!isSelectRange) {
      setShowToolbar(false);
      return;
    }
    if (range?.commonAncestorContainer && !containerRef?.current?.contains(range?.commonAncestorContainer)) {
      setShowToolbar(false);
      return;
    }
    changeToolBarPosition();
    setShowToolbar(true);
  }, [range]);

  const changeToolBarPosition = () => {
    const rect = range?.getBoundingClientRect();
    if (rect) setToolbarPosition([rect.left, window.scrollY + rect.bottom]);
  };

  return (
    <ToolbarWrapper toolbarRef={toolbarRef} showToolbar={showToolbar} toolbarPosition={toolbarPosition}>
      <ButtonWrapper>
        <ToolButton
          onClick={() => {
            setTag('b', null, containerRef, isSelectRange, range);
          }}
        >
          <BiBold size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setTag('u', null, containerRef, isSelectRange, range);
          }}
        >
          <BiUnderline size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setTag('i', null, containerRef, isSelectRange, range);
          }}
        >
          <BiItalic size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            let url = prompt('URL을 입력하세요', '');
            if (url && url.length > 0) {
              setTag('a', [{ name: 'href', value: url }], containerRef, isSelectRange, range);
            }
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
