import React from 'react';
import { SELECTION_RANGE } from '../common/const';
import { getSelectionInfo } from '../common/function';

function useSelection() {
  const [range, setRange] = React.useState<Range | null>(null);
  const [isSelectRange, setIsSelectRange] = React.useState(false);

  React.useEffect(() => {
    const selectionChangeCallback = () => {
      const selection = window.getSelection();

      if (selection?.type === SELECTION_RANGE) {
        const { range: newRange, isSelectRange: newIsSelectRange } = getSelectionInfo();

        setRange(newRange);
        setIsSelectRange(newIsSelectRange);
      } else {
        setRange(null);
        setIsSelectRange(false);
      }
    };
    document.addEventListener('selectionchange', selectionChangeCallback);
    return () => {
      document.removeEventListener('selectionchange', selectionChangeCallback);
    };
  }, []);

  return { range, isSelectRange };
}

export default useSelection;
