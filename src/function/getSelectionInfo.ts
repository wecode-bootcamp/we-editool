export default function getSelectionInfo(selection: Selection) {
  const range = selection.getRangeAt(0);
  return { range, isSelectRange: true, rect: range.getBoundingClientRect() };
}
