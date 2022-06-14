export default function removeChildNodes(
  divRef: React.RefObject<HTMLDivElement>,
  startIndex: number,
  endIndex: number
) {
  if (!divRef.current) {
    throw new Error('divRef.current not found');
  }
  const { childNodes } = divRef.current;
  for (let q = startIndex; q <= endIndex; q += 1) {
    childNodes[startIndex].remove();
  }
}
