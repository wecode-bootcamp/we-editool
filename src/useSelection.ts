import React from 'react';
import { SELECTION_RANGE } from './const';

function useSelection() {
  const [range, setRange] = React.useState<Range | null>(null);
  const [isSelectRange, setIsSelectRange] = React.useState(false);

  React.useEffect(() => {
    const selectionChangeCallback = () => {
      const selection = window.getSelection();

      if (selection?.type === SELECTION_RANGE) {
        setRange(selection.getRangeAt(0));
        setIsSelectRange(true);
      } else {
        setRange(null);
        setIsSelectRange(false);
      }
    };
    document.addEventListener('select', selectionChangeCallback);
    return () => {
      document.removeEventListener('select', selectionChangeCallback);
    };
  }, []);

  return { range, isSelectRange };
}

export default useSelection;
