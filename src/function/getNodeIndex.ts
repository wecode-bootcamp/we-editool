import { WE_EDITOR_ID } from '../common/const';

export default function getNodeIndex(childNodes: NodeListOf<ChildNode>, element: Element, offset: number) {
  let nodeIndex = -1;
  let newElement = element;
  const childNodeArray = Array.from(childNodes);

  // <br> tag process
  if (newElement.id === WE_EDITOR_ID) {
    newElement = newElement.childNodes[offset] as Element;
    nodeIndex = childNodeArray.indexOf(newElement);
  }

  if (newElement.parentElement?.id === WE_EDITOR_ID) {
    nodeIndex = childNodeArray.indexOf(newElement);
  }

  while (newElement.parentElement?.id !== WE_EDITOR_ID) {
    if (newElement) newElement = newElement.parentElement as Element;
    nodeIndex = childNodeArray.indexOf(newElement);
  }

  return nodeIndex;
}
