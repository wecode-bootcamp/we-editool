/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-destructuring */
import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';
import { ToolbarPostion } from './type';
import { WE_EDITOR_ID, TEXT_NODE_TYPE, BR_NAME, SELECTION_RANGE } from './const';
import useSelection from './useSelection';

interface ToolbarProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  setUndoList: React.Dispatch<React.SetStateAction<string[]>>;
  undoList: string[];
}

function Toolbar({ containerRef, setUndoList, undoList }: ToolbarProps) {
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
  }, [range]);

  function deepCopyList(list: any[]) {
    return Object.assign([], list);
  }

  const changeToolBarPosition = () => {
    const selection = window.getSelection();

    if (selection?.type !== SELECTION_RANGE) {
      setShowToolbar(false);
      return;
    }

    const rect = range?.getBoundingClientRect();
    if (rect) setToolbarPosition([rect.left, window.scrollY + rect.bottom]);
    setShowToolbar(true);
  };

  const getTextSegments = (selection: Selection): string[][] | null => {
    if (containerRef?.current && isSelectRange) {
      let startContainerParentNode = selection.getRangeAt(0).startContainer.parentElement;
      let endContainerParentNode = selection.getRangeAt(0).endContainer.parentElement;

      let firstIndex = 0;
      let lastIndex = 0;

      if (startContainerParentNode?.id && startContainerParentNode?.id === WE_EDITOR_ID) {
        firstIndex = Array.prototype.indexOf.call(
          containerRef.current.childNodes,
          selection.getRangeAt(0).startContainer
        );
      } else {
        while (startContainerParentNode?.parentElement?.id !== WE_EDITOR_ID) {
          if (startContainerParentNode) startContainerParentNode = startContainerParentNode?.parentElement;
        }

        firstIndex = Array.prototype.indexOf.call(containerRef.current.childNodes, startContainerParentNode);
      }

      if (endContainerParentNode?.id && endContainerParentNode.id === WE_EDITOR_ID) {
        lastIndex = Array.prototype.indexOf.call(containerRef.current.childNodes, selection.getRangeAt(0).endContainer);
      } else {
        while (endContainerParentNode?.parentElement?.id !== WE_EDITOR_ID) {
          if (endContainerParentNode) endContainerParentNode = endContainerParentNode?.parentElement;
        }

        lastIndex = Array.prototype.indexOf.call(containerRef.current.childNodes, endContainerParentNode);
      }

      const textSegments = [];
      for (let i = firstIndex; i <= lastIndex; i += 1) {
        let node = containerRef.current.childNodes[i];
        const textSegmentInfo: string[] = [];

        while (node.nodeType !== TEXT_NODE_TYPE) {
          textSegmentInfo.push(node.nodeName);
          node = node.childNodes[0];
        }

        if (node.nodeValue) {
          if (i === firstIndex) {
            if (firstIndex !== lastIndex) {
              const first = deepCopyList(textSegmentInfo);
              const second = deepCopyList(textSegmentInfo);
              first.push(node.nodeValue.substring(0, selection.getRangeAt(0).startOffset));
              textSegments.push(first);
              second.push(node.nodeValue.substring(selection.getRangeAt(0).startOffset, node.nodeValue.length));
              textSegments.push(second);
            } else {
              const first = deepCopyList(textSegmentInfo);
              const second = deepCopyList(textSegmentInfo);
              const third = deepCopyList(textSegmentInfo);
              first.push(node.nodeValue.substring(0, selection.getRangeAt(0).startOffset));
              textSegments.push(first);
              second.push(
                node.nodeValue.substring(selection.getRangeAt(0).startOffset, selection.getRangeAt(0).endOffset)
              );
              textSegments.push(second);
              third.push(node.nodeValue.substring(selection.getRangeAt(0).endOffset, node.nodeValue.length));
              textSegments.push(third);
            }
          } else if (i === lastIndex) {
            const first = deepCopyList(textSegmentInfo);
            const second = deepCopyList(textSegmentInfo);
            first.push(node.nodeValue.substring(0, selection.getRangeAt(0).endOffset));
            textSegments.push(first);
            second.push(node.nodeValue.substring(selection.getRangeAt(0).endOffset, node.nodeValue.length));
            textSegments.push(second);
          } else {
            textSegmentInfo.push(node.nodeValue);
            textSegments.push(textSegmentInfo);
          }
        }
      }
      const childNodes = containerRef.current.childNodes;
      for (let q = firstIndex; q <= lastIndex; q += 1) {
        childNodes[firstIndex].remove();
      }
      return textSegments;
    }
    return null;
  };
  const setFontStyle = (tagName: string): void => {
    const selection = window.getSelection();
    if (selection && isSelectRange) {
      const textSegments = getTextSegments(selection);

      if (!textSegments) {
        return;
      }
      let allTextisbold = true;
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        if (textSegments[i].indexOf(tagName.toUpperCase()) === -1) {
          allTextisbold = false;
          break;
        }
      }

      if (allTextisbold === true) {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i] = textSegments[i].filter((element) => element !== tagName.toUpperCase());
        }
      } else {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          if (textSegments[i].indexOf(tagName.toUpperCase()) === -1) {
            textSegments[i].splice(textSegments[i].length - 1, 0, tagName.toUpperCase());
          }
        }
      }

      for (let i = textSegments.length - 1; i >= 0; i -= 1) {
        if (textSegments[i].length > 0) {
          let lastElement;
          let newElement: any = document.createTextNode(textSegments[i][textSegments[i].length - 1]);
          for (let j = textSegments[i].length - 2; j >= 0; j -= 1) {
            lastElement = document.createElement(textSegments[i][j].toLowerCase());
            lastElement.appendChild(newElement);
            newElement = lastElement;
          }
          if (newElement) range?.insertNode(newElement);
        }
      }
    }
  };

  return (
    <ToolbarWrapper toolbarRef={toolbarRef} showToolbar={showToolbar} toolbarPosition={toolbarPosition}>
      <ButtonWrapper>
        <ToolButton
          onClick={() => {
            setFontStyle('b');
          }}
        >
          <BiBold size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setFontStyle('u');
          }}
        >
          <BiUnderline size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setFontStyle('i');
          }}
        >
          <BiItalic size="20" />
        </ToolButton>
        <ToolButton onClick={() => {}}>
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
