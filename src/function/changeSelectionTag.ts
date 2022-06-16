import { Attribute, TagInfo } from '../common/type';
import checkEverySegmentsHaveThisTag from './checkEverySegmentsHaveThisTag';
import createElementFromTextSegmentInfo from './createElementFromTextSegmentInfo';
import getSelectionInfo from './getSelectionInfo';
import getStartEndIndexOfRange from './getStartEndIndexOfRange';
import getTextSegments from './getTextSegments';
import removeChildNodes from './removeChildNodes';

export default function changeSelectionTag(
  selection: Selection,
  divRef: React.RefObject<HTMLDivElement>,
  changeTagName: keyof HTMLElementTagNameMap,
  attributes?: Attribute[]
) {
  const { range } = getSelectionInfo(selection);
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
