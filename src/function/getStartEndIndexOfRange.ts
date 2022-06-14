import * as React from 'react';

import getNodeIndex from './getNodeIndex';

export default function getStartEndIndexOfRange(divRef: React.RefObject<HTMLDivElement>, range: Range) {
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
}
