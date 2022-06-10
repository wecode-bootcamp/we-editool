import React from 'react';
import useSelection from '../hook/useSelection';
import { ToolbarPostion } from '../common/type';

function useSetToolbar(containerRef: React.MutableRefObject<HTMLDivElement | null>) {
  const [toolbarPosition, setToolbarPosition] = React.useState<ToolbarPostion>([0, 0]);
  const [showToolbar, setShowToolbar] = React.useState<boolean>(false);
  const { range, isSelectRange } = useSelection();

  React.useEffect(() => {
    const changeToolBarPosition = () => {
      const rect = range?.getBoundingClientRect();
      if (rect) setToolbarPosition([rect.left, window.scrollY + rect.bottom]);
    };

    if (!isSelectRange) {
      setShowToolbar(false);
      return;
    }
    if (range?.commonAncestorContainer && !containerRef?.current?.contains(range?.commonAncestorContainer)) {
      setShowToolbar(false);
      return;
    }
    changeToolBarPosition();
    setShowToolbar(true);
  }, [range, isSelectRange, containerRef]);

  return { toolbarPosition, showToolbar };
}

export default useSetToolbar;
