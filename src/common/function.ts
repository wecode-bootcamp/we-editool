import { TextSegmentInfo, TagInfo, AttributeInfo } from './type';
import { WE_EDITOR_ID } from './const';

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

const getTextSegments = (
  selection: Selection,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  isSelectRange: boolean
): TextSegmentInfo[] | null => {
  if (containerRef?.current && isSelectRange) {
    let startContainerParentNode = selection.getRangeAt(0).startContainer.parentElement;
    let endContainerParentNode = selection.getRangeAt(0).endContainer.parentElement;

    let firstIndex = 0;
    let lastIndex = 0;

    if ((selection.getRangeAt(0).startContainer as Element).id === WE_EDITOR_ID) {
      startContainerParentNode = selection.getRangeAt(0).startContainer.childNodes[
        selection.getRangeAt(0).startOffset
      ] as HTMLElement;
    }
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

    if ((selection.getRangeAt(0).endContainer as Element).id === WE_EDITOR_ID) {
      endContainerParentNode = selection.getRangeAt(0).endContainer.childNodes[
        selection.getRangeAt(0).endOffset
      ] as HTMLElement;
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

      while (node.nodeType !== Node.TEXT_NODE && node.nodeType === Node.ELEMENT_NODE && node.childNodes.length > 0) {
        const tagInfo: TagInfo = { name: '', attributes: [] };
        tagInfo.name = node.nodeName;
        const element: Element = node as Element;
        element.getAttributeNames().map((item) => {
          const newAttributeInfo: AttributeInfo = {
            name: item,
            value: element.getAttribute(item) ?? '',
          };
          tagInfo.attributes.push(newAttributeInfo);
          return null;
        });
        textSegmentInfo.tagInfos.push(tagInfo);

        [node] = node.childNodes;
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
      } else if (node.nodeName === 'BR') {
        const first = textSegmentInfo;
        const tagInfo: TagInfo = {
          name: '',
          attributes: [],
        };
        tagInfo.name = 'BR';
        first.tagInfos.push(tagInfo);
        textSegments.push(first);
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

const setTag = (
  tagName: string,
  attributes: AttributeInfo[] | null,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  isSelectRange: boolean,
  range: Range | null
): void => {
  const selection = window.getSelection();
  if (selection && isSelectRange) {
    const textSegments = getTextSegments(selection, containerRef, isSelectRange);
    if (!textSegments) {
      return;
    }
    let allSegmentsHaveTag = true;
    for (let i = 1; i < textSegments.length - 1; i += 1) {
      const tagNames: string[] = [];
      textSegments[i].tagInfos.map((item) => {
        tagNames.push(item.name);
        return null;
      });

      if (tagNames.indexOf(tagName.toUpperCase()) === -1 && tagNames.indexOf('BR') === -1) {
        allSegmentsHaveTag = false;
        break;
      }
    }

    if (allSegmentsHaveTag === true) {
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        textSegments[i].tagInfos = textSegments[i].tagInfos.filter((element) => element.name !== tagName.toUpperCase());
      }
    } else {
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        const tagNames: string[] = [];
        textSegments[i].tagInfos.map((item) => {
          tagNames.push(item.name);
          return null;
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
      let lastElement;
      let newElement;
      if (textSegments[i].innertext) {
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
      } else if (textSegments[i].tagInfos[0]?.name === 'BR') {
        newElement = document.createElement('br');
        range?.insertNode(newElement);
      }
    }
    selection.removeAllRanges();
  }
};

export { deepCopyTextSegmentInfo, getTextSegments, setTag };
