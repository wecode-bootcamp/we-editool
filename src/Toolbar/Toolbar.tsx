import * as React from 'react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { WE_EDITOR_ID, TEXT_NODE_TYPE } from '../common/const';
import { ToolbarPostion } from '../common/type';
import { deepCopyList } from '../common/util';
import useSelection from '../hook/useSelection';

interface ToolbarProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

function Toolbar({ containerRef }: ToolbarProps) {
  const { range, isSelectRange } = useSelection();
  const { toolbarPosition, showToolbar } = useToolbar({ range, isSelectRange, containerRef });

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
          const [childNode] = Array.from(node.childNodes);
          node = childNode;
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
      const { childNodes } = containerRef.current;
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
    <ToolbarWrapper showToolbar={showToolbar} toolbarPosition={toolbarPosition}>
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

interface UseToolbarProps {
  range: Range | null;
  isSelectRange: boolean;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

function useToolbar({ range, isSelectRange, containerRef }: UseToolbarProps) {
  const [showToolbar, setShowToolbar] = React.useState(false);
  const [toolbarPosition, setToolbarPosition] = React.useState<ToolbarPostion>([0, 0]);

  React.useEffect(() => {
    if (!containerRef.current?.contains(range?.commonAncestorContainer ?? null)) {
      setShowToolbar(false);
      return;
    }

    setShowToolbar(isSelectRange);

    const boundingClientRect = range?.getBoundingClientRect();
    if (boundingClientRect) {
      setToolbarPosition([boundingClientRect.left, window.scrollY + boundingClientRect.bottom]);
    }
  }, [containerRef, isSelectRange, range]);

  return { toolbarPosition, showToolbar };
}

export default Toolbar;

type ToolbarWrapperProps = {
  showToolbar: boolean;
  toolbarPosition: [number, number];
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
