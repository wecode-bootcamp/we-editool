import { TagInfo } from '../common/type';

export default function createElementFromTextSegmentInfo(innertext: string | null, tagInfos: TagInfo[]) {
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
}
