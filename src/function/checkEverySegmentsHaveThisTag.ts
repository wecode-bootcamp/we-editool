import { TextSegmentInfo } from '../common/type';
import getStartEndIndexOfRange from './getStartEndIndexOfRange';
import getTextSegments from './getTextSegments';

export default function checkEverySegmentsHaveThisTag(
  tagName: keyof HTMLElementTagNameMap,
  textSegments: TextSegmentInfo[],
  divRef?: React.RefObject<HTMLDivElement>
) {
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
}
