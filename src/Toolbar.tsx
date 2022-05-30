/* eslint-disable no-multi-assign */
/* eslint-disable prefer-destructuring */
import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';

interface ToolbarProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

function Toolbar({ containerRef }: ToolbarProps) {
  const [toolbarPosition, setToolbarPosition] = useState<[number, number]>([0, 0]);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener('pointerup', (e) => {
      const selection: Selection | null = window.getSelection();

      if (selection && selection.type === 'Caret') {
        setShowToolbar(false);
      }

      if (selection && selection.type === 'Range') {
        const range = selection.getRangeAt(0);
        if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
          calculateToolBarPosition();
        } else {
          setShowToolbar(false);
        }
      } else {
        setShowToolbar(false);
      }
    });
  }, [containerRef]);

  const calculateToolBarPosition = () => {
    const selection: Selection | null = window.getSelection();

    if (selection && selection.type === 'Range') {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPosition([rect.left, window.scrollY + rect.bottom]);
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  interface TextSegmentInfo {
    bold: boolean;
    underline: boolean;
    italic: boolean;
    text: string;
    parentNode: Node;
    index: number;
  }
  const getTextSegments = (selection: Selection): TextSegmentInfo[] | null => {
    if (containerRef.current && selection.type === 'Range') {
      let startContainerParentNode = selection.getRangeAt(0).startContainer.parentNode;
      let endContainerParentNode = selection.getRangeAt(0).endContainer.parentNode;

      let firstIndex = 0;
      let lastIndex = 0;

      if (
        (startContainerParentNode as Element).id &&
        (startContainerParentNode as Element).id === 'weEditorContainer'
      ) {
        firstIndex = Array.prototype.indexOf.call(
          containerRef.current.childNodes,
          selection.getRangeAt(0).startContainer
        );
      } else {
        while (
          startContainerParentNode &&
          (startContainerParentNode.parentNode as Element).id &&
          (startContainerParentNode.parentNode as Element).id !== 'weEditorContainer'
        ) {
          startContainerParentNode = startContainerParentNode.parentNode;
        }

        firstIndex = Array.prototype.indexOf.call(containerRef.current.childNodes, startContainerParentNode);
      }

      if ((endContainerParentNode as Element).id && (endContainerParentNode as Element).id === 'weEditorContainer') {
        lastIndex = Array.prototype.indexOf.call(containerRef.current.childNodes, selection.getRangeAt(0).endContainer);
      } else {
        while (
          endContainerParentNode &&
          (endContainerParentNode.parentNode as Element).id &&
          (endContainerParentNode.parentNode as Element).id !== 'weEditorContainer'
        ) {
          endContainerParentNode = endContainerParentNode.parentNode;
        }

        lastIndex = Array.prototype.indexOf.call(containerRef.current.childNodes, endContainerParentNode);
      }

      const textSegments = [];
      for (let i = firstIndex; i <= lastIndex; i += 1) {
        let node = containerRef.current.childNodes[i];
        const textSegmentInfo: TextSegmentInfo = {
          bold: false,
          underline: false,
          italic: false,
          text: '',
          parentNode: node,
          index: i,
        };
        while (node.nodeType !== 3) {
          if (node.nodeName === 'B') {
            textSegmentInfo.bold = true;
          } else if (node.nodeName === 'U') {
            textSegmentInfo.underline = true;
          } else if (node.nodeName === 'I') {
            textSegmentInfo.italic = true;
          }
          node = node.childNodes[0];
        }

        if (node.nodeValue && i === firstIndex) {
          if (selection.getRangeAt(0).startContainer !== selection.getRangeAt(0).endContainer) {
            textSegmentInfo.text = node.nodeValue.substring(0, selection.getRangeAt(0).startOffset);
            textSegments.push(JSON.parse(JSON.stringify(textSegmentInfo)));
            textSegmentInfo.text = node.nodeValue.substring(selection.getRangeAt(0).startOffset, node.nodeValue.length);
            textSegments.push(textSegmentInfo);
          } else {
            textSegmentInfo.text = node.nodeValue.substring(0, selection.getRangeAt(0).startOffset);
            textSegments.push(JSON.parse(JSON.stringify(textSegmentInfo)));
            textSegmentInfo.text = node.nodeValue.substring(
              selection.getRangeAt(0).startOffset,
              selection.getRangeAt(0).endOffset
            );
            textSegments.push(JSON.parse(JSON.stringify(textSegmentInfo)));
            textSegmentInfo.text = node.nodeValue.substring(selection.getRangeAt(0).endOffset, node.nodeValue.length);
            textSegments.push(textSegmentInfo);
          }
        } else if (node.nodeValue && i === lastIndex) {
          textSegmentInfo.text = node.nodeValue.substring(0, selection.getRangeAt(0).endOffset);
          textSegments.push(textSegmentInfo);
          const textSegment = JSON.parse(JSON.stringify(textSegmentInfo));

          textSegment.text = node.nodeValue.substring(selection.getRangeAt(0).endOffset, node.nodeValue.length);
          textSegments.push(textSegment);
        } else {
          if (node.nodeValue) {
            textSegmentInfo.text = node.nodeValue;
          }
          textSegments.push(textSegmentInfo);
        }
      }

      return textSegments;
    }
    return null;
  };

  const setBold = (): void => {
    const selection = window.getSelection();
    if (selection && selection.type === 'Range') {
      const textSegments = getTextSegments(selection);
      if (!textSegments) {
        return;
      }
      let allTextisbold = true;
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        if (textSegments[i].bold !== true) {
          allTextisbold = false;
          break;
        }
      }

      if (allTextisbold === true) {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i].bold = false;
        }
      } else {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i].bold = true;
        }
      }
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        if (containerRef.current && textSegments.length !== 3) {
          containerRef.current.removeChild(textSegments[i].parentNode);
        } else if (containerRef.current) {
          containerRef.current.removeChild(textSegments[2].parentNode);
          break;
        }
      }
      const range = selection.getRangeAt(0);

      for (let i = textSegments.length - 1; i >= 0; i -= 1) {
        if (!textSegments[i].bold && !textSegments[i].underline && !textSegments[i].italic) {
          range.insertNode(document.createTextNode(textSegments[i].text));
        } else {
          let newElement;
          let lastElement;
          if (textSegments[i].bold) {
            lastElement = newElement = document.createElement('b');
          }
          if (textSegments[i].underline) {
            if (lastElement === undefined) {
              lastElement = newElement = document.createElement('u');
            } else {
              lastElement.appendChild(document.createElement('u'));
              lastElement = lastElement.childNodes[0];
            }
          }
          if (textSegments[i].italic) {
            if (lastElement === undefined) {
              lastElement = newElement = document.createElement('i');
            } else {
              lastElement.appendChild(document.createElement('i'));
              lastElement = lastElement.childNodes[0];
            }
          }
          if (lastElement) lastElement.appendChild(document.createTextNode(textSegments[i].text));
          if (newElement) range.insertNode(newElement);
        }
      }
    }
  };

  const setUnderLine = () => {
    const selection = window.getSelection();
    if (selection && selection.type === 'Range') {
      const textSegments = getTextSegments(selection);
      if (!textSegments) {
        return;
      }
      let allTextisUnderline = true;
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        if (textSegments[i].underline !== true) {
          allTextisUnderline = false;
          break;
        }
      }

      if (allTextisUnderline === true) {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i].underline = false;
        }
      } else {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i].underline = true;
        }
      }
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        if (containerRef.current && textSegments.length !== 3) {
          containerRef.current.removeChild(textSegments[i].parentNode);
        } else if (containerRef.current) {
          containerRef.current.removeChild(textSegments[2].parentNode);
          break;
        }
      }
      const range = selection.getRangeAt(0);

      for (let i = textSegments.length - 1; i >= 0; i -= 1) {
        if (!textSegments[i].bold && !textSegments[i].underline && !textSegments[i].italic) {
          range.insertNode(document.createTextNode(textSegments[i].text));
        } else {
          let newElement;
          let lastElement;
          if (textSegments[i].bold) {
            lastElement = newElement = document.createElement('b');
          }
          if (textSegments[i].underline) {
            if (lastElement === undefined) {
              lastElement = newElement = document.createElement('u');
            } else {
              lastElement.appendChild(document.createElement('u'));
              lastElement = lastElement.childNodes[0];
            }
          }
          if (textSegments[i].italic) {
            if (lastElement === undefined) {
              lastElement = newElement = document.createElement('i');
            } else {
              lastElement.appendChild(document.createElement('i'));
              lastElement = lastElement.childNodes[0];
            }
          }
          if (lastElement) lastElement.appendChild(document.createTextNode(textSegments[i].text));
          if (newElement) range.insertNode(newElement);
        }
      }
    }
  };

  const setItalic = () => {
    const selection = window.getSelection();
    if (selection && selection.type === 'Range') {
      const textSegments = getTextSegments(selection);
      if (!textSegments) {
        return;
      }
      let allTextisItalic = true;
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        if (textSegments[i].italic !== true) {
          allTextisItalic = false;
          break;
        }
      }

      if (allTextisItalic === true) {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i].italic = false;
        }
      } else {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i].italic = true;
        }
      }
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        if (containerRef.current && textSegments.length !== 3) {
          containerRef.current.removeChild(textSegments[i].parentNode);
        } else if (containerRef.current) {
          containerRef.current.removeChild(textSegments[2].parentNode);
          break;
        }
      }
      const range = selection.getRangeAt(0);

      for (let i = textSegments.length - 1; i >= 0; i -= 1) {
        if (!textSegments[i].bold && !textSegments[i].underline && !textSegments[i].italic) {
          range.insertNode(document.createTextNode(textSegments[i].text));
        } else {
          let newElement;
          let lastElement;
          if (textSegments[i].bold) {
            lastElement = newElement = document.createElement('b');
          }
          if (textSegments[i].underline) {
            if (lastElement === undefined) {
              lastElement = newElement = document.createElement('u');
            } else {
              lastElement.appendChild(document.createElement('u'));
              lastElement = lastElement.childNodes[0];
            }
          }
          if (textSegments[i].italic) {
            if (lastElement === undefined) {
              lastElement = newElement = document.createElement('i');
            } else {
              lastElement.appendChild(document.createElement('i'));
              lastElement = lastElement.childNodes[0];
            }
          }
          if (lastElement) lastElement.appendChild(document.createTextNode(textSegments[i].text));
          if (newElement) range.insertNode(newElement);
        }
      }
    }
  };

  const setLink = () => {};

  return (
    <ToolbarWrapper toolbarRef={toolbarRef} showToolbar={showToolbar} toolbarPosition={toolbarPosition}>
      <ButtonWrapper>
        <ToolButton
          onClick={() => {
            setBold();
          }}
        >
          <BiBold size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setUnderLine();
          }}
        >
          <BiUnderline size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setItalic();
          }}
        >
          <BiItalic size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setLink();
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