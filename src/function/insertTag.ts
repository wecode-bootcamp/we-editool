import { WE_EDITOR_ID } from '../common/const';
import { Attribute, TagInfo, TextSegmentInfo } from '../common/type';

import createElementFromTextSegmentInfo from './createElementFromTextSegmentInfo';

export default function insertTag(
  divRef: React.RefObject<HTMLDivElement>,
  tagName: keyof HTMLElementTagNameMap,
  attributes?: Attribute[] | null,
  keyboardEvent?: KeyboardEvent
) {
  if (!divRef.current) {
    throw new Error('no div ref');
  }

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  if (!range) {
    throw new Error('no range');
  }

  const offset = range.startOffset;

  if (!range.commonAncestorContainer.nodeValue || !divRef.current.contains(range.commonAncestorContainer)) {
    return;
  }

  keyboardEvent?.preventDefault();

  if (
    (range.commonAncestorContainer.nodeType === Node.TEXT_NODE &&
      range.commonAncestorContainer.parentElement?.id === WE_EDITOR_ID) ||
    (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE &&
      (range.commonAncestorContainer as Element).id === WE_EDITOR_ID)
  ) {
    const tag = document.createElement(tagName);
    if (attributes && attributes.length > 0) {
      for (let h = 0; h < attributes.length; h += 1) {
        tag.setAttribute(attributes[h].name, attributes[h].value);
      }
    }
    range.deleteContents();
    range.insertNode(tag);
    range.setStartAfter(tag);
    range.setEndAfter(tag);
    range.collapse(false);
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
      const newAttribute: Attribute = {
        name: item,
        value: element.getAttribute(item) ?? '',
      };
      tagInfo.attributes.push(newAttribute);
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
