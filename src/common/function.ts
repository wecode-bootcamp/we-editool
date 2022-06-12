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
    const [startIndex, endIndex] = getStartEndIndexOfRange(divRef, range);
    const textSegments = getTextSegments(divRef, range, startIndex, endIndex);

    if (!textSegments) {
      return;
    }

    removeChildNodes(divRef, startIndex, endIndex);

    const allSegmentsHaveTag = checkEverySegmentsHaveThisTag(changeTagName, textSegments);

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
      let newElement;
      if (textSegments[i].innertext) {
        newElement = createElementFromTextSegmentInfo(textSegments[i].innertext, textSegments[i].tagInfos);
        if (newElement) range?.insertNode(newElement);
      } else if (textSegments[i].tagInfos[0]?.name === 'BR') {
        newElement = document.createElement('br');
        range?.insertNode(newElement);
      }
    }
    selection.removeAllRanges();
  }
};

const getTextSegments = (
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  range: Range,
  startIndex: number,
  endIndex: number
): TextSegmentInfo[] | null => {
  if (!divRef.current) {
    throw new Error('div ref current is null');
  }

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

  return textSegments;
};

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

const getStartEndIndexOfRange = (divRef: React.MutableRefObject<HTMLDivElement | null>, range: Range): number[] => {
  if (!divRef.current) {
    throw new Error('divRef.current not found');
  }

  const startElement = range.startContainer as Element;
  const endElement = range.endContainer as Element;

  if (!startElement) {
    throw new Error('startElement not found');
  }

  const startIndex = getNodeIndex(divRef.current.childNodes, startElement, range.startOffset);
  const endIndex = getNodeIndex(divRef.current.childNodes, endElement, range.endOffset);
  return [startIndex, endIndex];
};

const removeChildNodes = (
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  startIndex: number,
  endIndex: number
) => {
  if (!divRef.current) {
    throw new Error('divRef.current not found');
  }
  const { childNodes } = divRef.current;
  for (let q = startIndex; q <= endIndex; q += 1) {
    childNodes[startIndex].remove();
  }
};

const checkEverySegmentsHaveThisTag = (
  tagName: keyof HTMLElementTagNameMap,
  textSegments: TextSegmentInfo[],
  divRef?: React.MutableRefObject<HTMLDivElement | null>
): boolean => {
  let allSegmentsHaveTag = true;
  let newTextSegments: TextSegmentInfo[] | null | undefined;

  if (textSegments?.length === 0) {
    if (!divRef) {
      throw new Error('div ref not found');
    }
    const selection = window.getSelection();
    const range: Range | undefined = selection?.getRangeAt(0);
    if (!range) {
      throw new Error('range not found');
    }
    const [startIndex, endIndex] = getStartEndIndexOfRange(divRef, range);
    newTextSegments = getTextSegments(divRef, range, startIndex, endIndex);
  } else {
    newTextSegments = textSegments;
  }

  if (!newTextSegments) {
    newTextSegments = [];
  }

  for (let i = 1; i < newTextSegments.length - 1; i += 1) {
    const tagNames: string[] = [];
    newTextSegments[i].tagInfos.map((item) => {
      tagNames.push(item.name);
      return false;
    });

    if (tagNames.indexOf(tagName.toUpperCase()) === -1 && tagNames.indexOf('BR') === -1) {
      allSegmentsHaveTag = false;
      break;
    }
  }
  return allSegmentsHaveTag;
};

const createElementFromTextSegmentInfo = (innertext: string | null, tagInfos: TagInfo[]): Element | null => {
  let lastElement;
  let newElement;

  if (innertext) newElement = document.createTextNode(innertext);
  if (newElement?.nodeValue?.length) {
    for (let j = tagInfos.length - 1; j >= 0; j -= 1) {
      lastElement = document.createElement(tagInfos[j].name.toLowerCase());

      for (let h = 0; h < tagInfos[j].attributes.length; h += 1) {
        lastElement.setAttribute(tagInfos[j].attributes[h].name, tagInfos[j].attributes[h].value);
      }
      lastElement.appendChild(newElement as Element);
      newElement = lastElement;
    }
    return newElement as Element;
  }
  return null;
};

const insertTag = (
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  tagName: string,
  attributes?: AttributeInfo[] | null,
  keyboardEvent?: KeyboardEvent
): void => {
  if (divRef?.current) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const offset = selection?.getRangeAt(0).startOffset;

    if (
      (range && range.commonAncestorContainer && !divRef?.current?.contains(range.commonAncestorContainer)) ||
      range?.commonAncestorContainer.nodeValue === undefined
    ) {
      return;
    }

    keyboardEvent?.preventDefault();

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

    textSegmentInfo.innertext = range?.commonAncestorContainer.nodeValue;
    let candidateParentElement = range?.commonAncestorContainer.parentElement as Element;
    let candidateElement;
    while (candidateParentElement?.id !== WE_EDITOR_ID) {
      const tagInfo: TagInfo = { name: '', attributes: [] };
      tagInfo.name = candidateParentElement?.nodeName ?? '';
      const element: Element = candidateParentElement as Element;
      element.getAttributeNames().map((item) => {
        const newAttributeInfo: AttributeInfo = {
          name: item,
          value: element.getAttribute(item) ?? '',
        };
        tagInfo.attributes.push(newAttributeInfo);
        return null;
      });
      textSegmentInfo.tagInfos.push(tagInfo);
      candidateElement = candidateParentElement;
      candidateParentElement = candidateParentElement.parentElement as Element;
    }
    candidateElement?.remove();
    if (!textSegmentInfo.innertext || offset === undefined) {
      return;
    }

    let newElement = createElementFromTextSegmentInfo(
      textSegmentInfo.innertext.substring(offset, textSegmentInfo.innertext?.length),
      textSegmentInfo.tagInfos
    );

    if (newElement) range?.insertNode(newElement);

    const tag = document.createElement(tagName);

    if (attributes && attributes.length > 0) {
      for (let h = 0; h < attributes.length; h += 1) {
        tag.setAttribute(attributes[h].name, attributes[h].value);
      }
    }

    range?.insertNode(tag);

    newElement = createElementFromTextSegmentInfo(
      textSegmentInfo.innertext.substring(0, offset),
      textSegmentInfo.tagInfos
    );
    if (newElement) range?.insertNode(newElement);

    range?.setStartAfter(tag);
    range?.setEndAfter(tag);
    range?.collapse(false);
    selection?.removeAllRanges();
    if (range) selection?.addRange(range);
  }
};

export {
  deepCopyTextSegmentInfo,
  getTextSegments,
  changeSelectionTag,
  getStartEndIndexOfRange,
  checkEverySegmentsHaveThisTag,
  insertTag,
};
