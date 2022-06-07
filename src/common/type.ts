type ToolbarPostion = [number, number];

interface TextSegmentInfo {
  tagInfos: TagInfo[];
  innertext: string | null;
}

interface TagInfo {
  name: string;
  attributes: AttributeInfo[];
}

interface AttributeInfo {
  name: string;
  value: string;
}
export { ToolbarPostion, TextSegmentInfo, TagInfo, AttributeInfo };
