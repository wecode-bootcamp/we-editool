import React from 'react';
import { WE_EDITOR_ID } from '../common/const';
import { TextSegmentInfo, TagInfo, AttributeInfo } from '../common/type';

function usePressKey(containerRef: React.MutableRefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.onkeyup = () => {
        const a = document.activeElement;
        if (a?.lastChild?.nodeName !== 'BR') {
          a?.appendChild(document.createElement('br'));
        }
      };
      containerRef.current.onkeydown = (e) => {
        if (e.key !== 'Enter') {
          return;
        }
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const offset = selection?.getRangeAt(0).startOffset;
        if (range?.commonAncestorContainer && !containerRef?.current?.contains(range?.commonAncestorContainer)) {
          return;
        }
        e.preventDefault();
        if (
          range?.commonAncestorContainer.nodeType === Node.TEXT_NODE &&
          range?.commonAncestorContainer?.parentElement?.id === WE_EDITOR_ID
        ) {
          const br = document.createElement('br');
          range?.deleteContents();
          range?.insertNode(br);
          range?.setStartAfter(br);
          range?.setEndAfter(br);
          range?.collapse(false);
          selection?.removeAllRanges();
          if (range) selection?.addRange(range);
          return;
        } else if (
          range?.commonAncestorContainer.nodeType === Node.ELEMENT_NODE &&
          (range?.commonAncestorContainer as Element).id === WE_EDITOR_ID
        ) {
          const br = document.createElement('br');
          range?.deleteContents();
          range?.insertNode(br);
          range?.setStartAfter(br);
          range?.setEndAfter(br);
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
          });
          if (node) node = node.parentNode;
        }
        (node2 as Element).remove();

        let lastElement;
        let newElement;

        if (textnode?.nodeValue)
          newElement = document.createTextNode(textnode?.nodeValue?.substring(offset!, textnode?.nodeValue.length));

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

        if (range) selection?.addRange(range);
        const br = document.createElement('br');
        range?.insertNode(br);

        if (textnode?.nodeValue) newElement = document.createTextNode(textnode?.nodeValue?.substring(0, offset));

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
      };
    }
  }, []);
}

export default usePressKey;
