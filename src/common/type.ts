type ToolbarPostion = [number, number];

interface TextSegmentInfo {
  tagInfos: TagInfo[];
  innertext: string | null;
}

interface TagInfo {
  name: string;
  attributes: Attribute[];
}

interface Attribute {
  name: string;
  value: string;
}

export { ToolbarPostion, TextSegmentInfo, TagInfo, Attribute };
