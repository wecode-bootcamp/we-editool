import { TagInfo, TextSegmentInfo } from '../common/type';

export default function deepCopyTextSegmentInfo(textSegmentInfo: TextSegmentInfo): TextSegmentInfo {
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
      const newAttribute = {
        name: '',
        value: '',
      };
      newAttribute.name = textSegmentInfo.tagInfos[i].attributes[j].name;
      newAttribute.value = textSegmentInfo.tagInfos[i].attributes[j].value;
      newTagInfo.attributes.push(newAttribute);
    }
    newTextSegmentInfo.tagInfos.push(newTagInfo);
  }
  return newTextSegmentInfo;
}
