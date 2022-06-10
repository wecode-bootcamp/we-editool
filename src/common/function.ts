import { TextSegmentInfo, TagInfo, AttributeInfo } from './type';
import { SELECTION_RANGE, WE_EDITOR_ID } from './const';

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

function getNodeIndex(childNodes: NodeListOf<ChildNode>, element: Element, offset: number) {
  let nodeIndex = -1;
  let newElement = element;
  const childNodeArray = Array.from(childNodes);

  // <br> tag process
  if (newElement.id === WE_EDITOR_ID) {
    newElement = newElement.childNodes[offset] as Element;
    nodeIndex = childNodeArray.indexOf(newElement);
  }

  if (newElement.parentElement?.id === WE_EDITOR_ID) {
    nodeIndex = childNodeArray.indexOf(newElement);
  }

  while (newElement.parentElement?.id !== WE_EDITOR_ID) {
    if (newElement) newElement = newElement.parentElement as Element;
    nodeIndex = childNodeArray.indexOf(newElement);
  }

  return nodeIndex;
}

const getTextSegments = (
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  range: Range
): TextSegmentInfo[] | null => {
  if (!divRef.current) {
    throw new Error('div ref current is null');
  }

  const startElement = range.startContainer as Element;
  const endElement = range.endContainer as Element;

  if (!startElement) {
    throw new Error('startElement not found');
  }

  const startIndex = getNodeIndex(divRef.current.childNodes, startElement, range.startOffset);
  const endIndex = getNodeIndex(divRef.current.childNodes, endElement, range.endOffset);
  if (startIndex === -1 || endIndex === -1) throw new Error('startIndex or endIndex is -1');

  const textSegments = [];

  for (let i = startIndex; i <= endIndex; i += 1) {
    let candidateSegment = divRef.current.childNodes[i];
    const textSegmentInfo: TextSegmentInfo = {
      tagInfos: [],
      innertext: null,
    };

    while (
      candidateSegment.nodeType !== Node.TEXT_NODE &&
      candidateSegment.nodeType === Node.ELEMENT_NODE &&
      candidateSegment.childNodes.length > 0
    ) {
      const tagInfo: TagInfo = { name: '', attributes: [] };
      tagInfo.name = candidateSegment.nodeName;
      const element: Element = candidateSegment as Element;
      element.getAttributeNames().map((item) => {
        const newAttributeInfo: AttributeInfo = {
          name: item,
          value: element.getAttribute(item) ?? '',
        };
        tagInfo.attributes.push(newAttributeInfo);
        return null;
      });
      textSegmentInfo.tagInfos.push(tagInfo);

      [candidateSegment] = candidateSegment.childNodes;
    }

    if (candidateSegment.nodeValue) {
      if (i === startIndex) {
        if (startIndex !== endIndex) {
          const first = textSegmentInfo;
          const second = deepCopyTextSegmentInfo(textSegmentInfo);
          first.innertext = candidateSegment.nodeValue.substring(0, range.startOffset);
          textSegments.push(first);
          second.innertext = candidateSegment.nodeValue.substring(range.startOffset, candidateSegment.nodeValue.length);
          textSegments.push(second);
        } else {
          const first = textSegmentInfo;
          const second = deepCopyTextSegmentInfo(textSegmentInfo);
          const third = deepCopyTextSegmentInfo(textSegmentInfo);
          first.innertext = candidateSegment.nodeValue.substring(0, range.startOffset);
          textSegments.push(first);
          second.innertext = candidateSegment.nodeValue.substring(range.startOffset, range.endOffset);
          textSegments.push(second);
          third.innertext = candidateSegment.nodeValue.substring(range.endOffset, candidateSegment.nodeValue.length);
          textSegments.push(third);
        }
      } else if (i === endIndex) {
        const first = textSegmentInfo;
        const second = deepCopyTextSegmentInfo(textSegmentInfo);
        first.innertext = candidateSegment.nodeValue.substring(0, range.endOffset);
        textSegments.push(first);
        second.innertext = candidateSegment.nodeValue.substring(range.endOffset, candidateSegment.nodeValue.length);
        textSegments.push(second);
      } else {
        textSegmentInfo.innertext = candidateSegment.nodeValue;
        textSegments.push(textSegmentInfo);
      }
    } else if (candidateSegment.nodeName === 'BR') {
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
  const { childNodes } = divRef.current;
  for (let q = startIndex; q <= endIndex; q += 1) {
    childNodes[startIndex].remove();
  }
  return textSegments;
};

export function getSelectionInfo() {
  const selection = window.getSelection();

  return selection && selection.type === SELECTION_RANGE
    ? { range: selection.getRangeAt(0), isSelectRange: true }
    : { range: null, isSelectRange: false };
}

const changeSelectionTag = (
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  changeTagName: keyof HTMLElementTagNameMap,
  attributes?: AttributeInfo[]
): void => {
  const selection = window.getSelection();

  const { range } = getSelectionInfo();

  if (!divRef) {
    throw new Error('divRef not found');
  }

  if (selection && range) {
    const textSegments = getTextSegments(divRef, range);

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

      if (tagNames.indexOf(changeTagName.toUpperCase()) === -1 && tagNames.indexOf('BR') === -1) {
        allSegmentsHaveTag = false;
        break;
      }
    }

    if (allSegmentsHaveTag === true) {
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        textSegments[i].tagInfos = textSegments[i].tagInfos.filter(
          (element) => element.name !== changeTagName.toUpperCase()
        );
      }
    } else {
      for (let i = 1; i < textSegments.length - 1; i += 1) {
        const tagNames: string[] = [];
        textSegments[i].tagInfos.map((item) => {
          tagNames.push(item.name);
          return null;
        });

        if (tagNames.indexOf(changeTagName.toUpperCase()) === -1) {
          const tagInfo: TagInfo = {
            name: changeTagName.toUpperCase(),
            attributes: attributes ?? [],
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

const insertTag = (
  tagName: string,
  attributes: AttributeInfo[] | null,
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  range: Range | null
): void => {
  const newContainerRef = divRef;
  if (newContainerRef?.current) {
    const selection = window.getSelection();
    const offset = selection?.getRangeAt(0).startOffset;
    if (range?.commonAncestorContainer && !divRef?.current?.contains(range?.commonAncestorContainer)) {
      return;
    }

    if (
      (range?.commonAncestorContainer.nodeType === Node.TEXT_NODE &&
        range?.commonAncestorContainer?.parentElement?.id === WE_EDITOR_ID) ||
      (range?.commonAncestorContainer.nodeType === Node.ELEMENT_NODE &&
        (range?.commonAncestorContainer as Element).id === WE_EDITOR_ID)
    ) {
      const tag = document.createElement(tagName);
      if (attributes && attributes.length > 0) {
        for (let h = 0; h < attributes.length; h += 1) {
          tag.setAttribute(attributes[h].name, attributes[h].value);
        }
      }
      range?.deleteContents();
      range?.insertNode(tag);
      range?.setStartAfter(tag);
      range?.setEndAfter(tag);
      range?.collapse(false);
      selection?.removeAllRanges();
      if (range) selection?.addRange(range);
      return;
    }

    const textSegmentInfo: TextSegmentInfo = { tagInfos: [], innertext: '' };
    const textnode = range?.commonAncestorContainer;
    let node = range?.commonAncestorContainer.parentNode;
    let node2;
    while ((node as Element).id !== WE_EDITOR_ID) {
      const tagInfo: TagInfo = { name: '', attributes: [] };
      tagInfo.name = node?.nodeName ?? '';
      textSegmentInfo.tagInfos.push(tagInfo);
      node2 = node;
      const element: Element = node as Element;
      element.getAttributeNames().map((item) => {
        const newAttributeInfo: AttributeInfo = {
          name: item,
          value: element.getAttribute(item) ?? '',
        };
        tagInfo.attributes.push(newAttributeInfo);
        return null;
      });
      if (node) node = node.parentNode;
    }
    (node2 as Element).remove();

    let lastElement;
    let newElement;

    if (textnode?.nodeValue && offset !== undefined)
      newElement = document.createTextNode(textnode?.nodeValue?.substring(offset, textnode?.nodeValue.length));
    if (newElement?.nodeValue?.length) {
      for (let j = textSegmentInfo.tagInfos.length - 1; j >= 0; j -= 1) {
        lastElement = document.createElement(textSegmentInfo.tagInfos[j].name.toLowerCase());

        for (let h = 0; h < textSegmentInfo.tagInfos[j].attributes.length; h += 1) {
          lastElement.setAttribute(
            textSegmentInfo.tagInfos[j].attributes[h].name,
            textSegmentInfo.tagInfos[j].attributes[h].value
          );
        }

        lastElement.appendChild(newElement as Element);
        newElement = lastElement;
      }
      if (newElement) range?.insertNode(newElement);
    }
    const tag = document.createElement(tagName);
    if (attributes && attributes.length > 0) {
      for (let h = 0; h < attributes.length; h += 1) {
        tag.setAttribute(attributes[h].name, attributes[h].value);
      }
    }
    range?.insertNode(tag);

    if (textnode?.nodeValue) newElement = document.createTextNode(textnode?.nodeValue?.substring(0, offset));
    if (newElement?.nodeValue?.length) {
      for (let j = textSegmentInfo.tagInfos.length - 1; j >= 0; j -= 1) {
        lastElement = document.createElement(textSegmentInfo.tagInfos[j].name.toLowerCase());

        for (let h = 0; h < textSegmentInfo.tagInfos[j].attributes.length; h += 1) {
          lastElement.setAttribute(
            textSegmentInfo.tagInfos[j].attributes[h].name,
            textSegmentInfo.tagInfos[j].attributes[h].value
          );
        }

        lastElement.appendChild(newElement as Element);
        newElement = lastElement;
      }
      if (newElement) range?.insertNode(newElement);
    }
    range?.setStartAfter(tag);
    range?.setEndAfter(tag);
    range?.collapse(false);
    selection?.removeAllRanges();
    if (range) selection?.addRange(range);
  }
};

export { deepCopyTextSegmentInfo, getTextSegments, changeSelectionTag, insertTag };
