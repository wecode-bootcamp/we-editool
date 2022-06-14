import React from 'react';
import { SELECTION_RANGE } from '../common/const';
import getSelectionInfo from '../function/getSelectionInfo';

function useSelection() {
  const [range, setRange] = React.useState<Range | null>(null);
  const [isSelectRange, setIsSelectRange] = React.useState(false);
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    const selectionChangeCallback = () => {
      const selection = window.getSelection();

      if (!selection || selection.type !== SELECTION_RANGE) {
        setRange(null);
        setIsSelectRange(false);
        setRect(null);

        return;
      }

      const { range: newRange, isSelectRange: newIsSelectRange, rect: newRect } = getSelectionInfo(selection);

      setRange(newRange);
      setIsSelectRange(newIsSelectRange);
      setRect(newRect);
    };
    document.addEventListener('selectionchange', selectionChangeCallback);
    return () => {
      document.removeEventListener('selectionchange', selectionChangeCallback);
    };
  }, []);

  return { range, isSelectRange, rect };
}

export default useSelection;
