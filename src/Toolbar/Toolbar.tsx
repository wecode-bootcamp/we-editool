/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-destructuring */
import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';
import { ToolbarPostion } from '../common/type';
import { WE_EDITOR_ID, TEXT_NODE_TYPE } from '../common/const';
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

  function deepCopyTextSegmentInfo(textSegmentInfo: TextSegmentInfo): TextSegmentInfo {
    const newTextSegmentInfo: TextSegmentInfo = {
      tagInfos: [],
      innertext: '',
    };
    if (textSegmentInfo.innertext) newTextSegmentInfo.innertext = textSegmentInfo.innertext;
    for (let i = 0; i < textSegmentInfo.tagInfos.length; i += 1) {
      const newTagInfo: TagInfo = {
        name: '',
        attributes: [],
      };
      newTagInfo.name = textSegmentInfo.tagInfos[i].name;
      for (let j = 0; j < textSegmentInfo.tagInfos[i].attributes.length; j += 1) {
        const newAttributeInfo = {
          name: '',
          value: '',
        };
        newAttributeInfo.name = textSegmentInfo.tagInfos[i].attributes[j].name;
        newAttributeInfo.value = textSegmentInfo.tagInfos[i].attributes[j].value;
        newTagInfo.attributes.push(newAttributeInfo);
      }
      newTextSegmentInfo.tagInfos.push(newTagInfo);
    }
    return newTextSegmentInfo;
  }

  const changeToolBarPosition = () => {
    const rect = range?.getBoundingClientRect();
    if (rect) setToolbarPosition([rect.left, window.scrollY + rect.bottom]);
  };

  interface TextSegmentInfo {
    tagInfos: TagInfo[];
    innertext: string | null;
  }

  interface TagInfo {
    name: string;
    attributes: AttributeInfo[];
  }

  interface AttributeInfo {
    name: string;
    value: string;
  }

  const getTextSegments = (selection: Selection): TextSegmentInfo[] | null => {
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
        const textSegmentInfo: TextSegmentInfo = {
          tagInfos: [],
          innertext: null,
        };

        while (node.nodeType !== Node.TEXT_NODE && node.nodeType === Node.ELEMENT_NODE) {
          const tagInfo: TagInfo = { name: '', attributes: [] };
          tagInfo.name = node.nodeName;
          const element: Element = node as Element;
          element.getAttributeNames().map((item) => {
            const newAttributeInfo: AttributeInfo = {
              name: item,
              value: element.getAttribute(item) ?? '',
            };
            tagInfo.attributes.push(newAttributeInfo);
          });

          textSegmentInfo.tagInfos.push(tagInfo);
          node = node.childNodes[0];
        }

        if (node.nodeValue) {
          if (i === firstIndex) {
            if (firstIndex !== lastIndex) {
              const first = textSegmentInfo;
              const second = deepCopyTextSegmentInfo(textSegmentInfo);
              first.innertext = node.nodeValue.substring(0, selection.getRangeAt(0).startOffset);
              textSegments.push(first);
              second.innertext = node.nodeValue.substring(selection.getRangeAt(0).startOffset, node.nodeValue.length);
              textSegments.push(second);
            } else {
              const first = textSegmentInfo;
              const second = deepCopyTextSegmentInfo(textSegmentInfo);
              const third = deepCopyTextSegmentInfo(textSegmentInfo);
              first.innertext = node.nodeValue.substring(0, selection.getRangeAt(0).startOffset);
              textSegments.push(first);
              second.innertext = node.nodeValue.substring(
                selection.getRangeAt(0).startOffset,
                selection.getRangeAt(0).endOffset
              );
              textSegments.push(second);
              third.innertext = node.nodeValue.substring(selection.getRangeAt(0).endOffset, node.nodeValue.length);
              textSegments.push(third);
            }
          } else if (i === lastIndex) {
            const first = textSegmentInfo;
            const second = deepCopyTextSegmentInfo(textSegmentInfo);
            first.innertext = node.nodeValue.substring(0, selection.getRangeAt(0).endOffset);
            textSegments.push(first);
            second.innertext = node.nodeValue.substring(selection.getRangeAt(0).endOffset, node.nodeValue.length);
            textSegments.push(second);
          } else {
            textSegmentInfo.innertext = node.nodeValue;
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
  const setFontStyle = (tagName: string, attributes: AttributeInfo[] | null): void => {
    const selection = window.getSelection();
    if (selection && isSelectRange) {
      const textSegments = getTextSegments(selection);
      if (!textSegments) {
        return;
      }
      let allSegmentsHaveTag = true;
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        const tagNames: string[] = [];
        textSegments[i].tagInfos.map((item) => {
          tagNames.push(item.name);
        });

        if (tagNames.indexOf(tagName.toUpperCase()) === -1) {
          allSegmentsHaveTag = false;
          break;
        }
      }

      if (allSegmentsHaveTag === true) {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          textSegments[i].tagInfos = textSegments[i].tagInfos.filter(
            (element) => element.name !== tagName.toUpperCase()
          );
        }
      } else {
        for (let i = 1; i < textSegments.length - 1; i += 1) {
          const tagNames: string[] = [];
          textSegments[i].tagInfos.map((item) => {
            tagNames.push(item.name);
          });

          if (tagNames.indexOf(tagName.toUpperCase()) === -1) {
            let newAttributes: AttributeInfo[] = [];
            if (attributes) {
              newAttributes = attributes;
            } else {
              newAttributes = [];
            }
            const tagInfo: TagInfo = {
              name: tagName.toUpperCase(),
              attributes: newAttributes,
            };
            textSegments[i].tagInfos.push(tagInfo);
          }
        }
      }

      for (let i = textSegments.length - 1; i >= 0; i -= 1) {
        if (textSegments[i].innertext) {
          let lastElement;
          let newElement;
          newElement = document.createTextNode(textSegments[i].innertext ?? '');

          for (let j = textSegments[i].tagInfos.length - 1; j >= 0; j -= 1) {
            lastElement = document.createElement(textSegments[i].tagInfos[j].name.toLowerCase());

            for (let h = 0; h < textSegments[i].tagInfos[j].attributes.length; h += 1) {
              lastElement.setAttribute(
                textSegments[i].tagInfos[j].attributes[h].name,
                textSegments[i].tagInfos[j].attributes[h].value
              );
            }

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
            setFontStyle('b', null);
          }}
        >
          <BiBold size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setFontStyle('u', null);
          }}
        >
          <BiUnderline size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setFontStyle('i', null);
          }}
        >
          <BiItalic size="20" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            setFontStyle('a', [{ name: 'href', value: 'ht' }]);
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
