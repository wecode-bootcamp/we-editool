import { TagInfo, TextSegmentInfo } from '../common/type';

import deepCopyTextSegmentInfo from './deepCopyTextSegmentInfo';
import getAttributes from './getAttributes';

export default function getTextSegments(
  divRef: React.RefObject<HTMLDivElement>,
  range: Range,
  startIndex: number,
  endIndex: number
) {
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('startIndex or endIndex is -1');
  }

  if (!divRef.current) {
    throw new Error('no div current');
  }

  const textSegments: TextSegmentInfo[] = [];

  for (let i = startIndex; i <= endIndex; i += 1) {
    let childNode = divRef.current.childNodes[i];

    const textSegmentInfo: TextSegmentInfo = {
      tagInfos: [],
      innertext: null,
    };

    while (childNode.nodeType === Node.ELEMENT_NODE && childNode.childNodes.length > 0) {
      const childElement = childNode as Element;

      const newTagInfo = {
        name: childNode.nodeName,
        attributes: getAttributes(childElement),
      };

      textSegmentInfo.tagInfos.push(newTagInfo);

      [childNode] = childNode.childNodes;
    }

    if (childNode.nodeValue) {
      if (i === startIndex) {
        if (startIndex !== endIndex) {
          const first = textSegmentInfo;
          const second = deepCopyTextSegmentInfo(textSegmentInfo);
          first.innertext = childNode.nodeValue.substring(0, range.startOffset);
          textSegments.push(first);
          second.innertext = childNode.nodeValue.substring(range.startOffset, childNode.nodeValue.length);
          textSegments.push(second);
        } else {
          const first = textSegmentInfo;
          const second = deepCopyTextSegmentInfo(textSegmentInfo);
          const third = deepCopyTextSegmentInfo(textSegmentInfo);
          first.innertext = childNode.nodeValue.substring(0, range.startOffset);
          textSegments.push(first);
          second.innertext = childNode.nodeValue.substring(range.startOffset, range.endOffset);
          textSegments.push(second);
          third.innertext = childNode.nodeValue.substring(range.endOffset, childNode.nodeValue.length);
          textSegments.push(third);
        }
      } else if (i === endIndex) {
        const first = textSegmentInfo;
        const second = deepCopyTextSegmentInfo(textSegmentInfo);
        first.innertext = childNode.nodeValue.substring(0, range.endOffset);
        textSegments.push(first);
        second.innertext = childNode.nodeValue.substring(range.endOffset, childNode.nodeValue.length);
        textSegments.push(second);
      } else {
        textSegmentInfo.innertext = childNode.nodeValue;
        textSegments.push(textSegmentInfo);
      }
    } else if (childNode.nodeName === 'BR') {
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
}
