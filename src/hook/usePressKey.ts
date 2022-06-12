import React from 'react';
import { insertTag } from '../common/function';

function usePressKey(divRef: React.MutableRefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const newDivRef = divRef;
    if (!newDivRef?.current) {
      return;
    }
    newDivRef.current.onkeyup = () => {
      // Add two <br> when you press Enter at the end of the text node
      const { activeElement } = document;
      if (activeElement?.lastChild?.nodeName !== 'BR') {
        activeElement?.appendChild(document.createElement('br'));
      }
    };
    newDivRef.current.onkeydown = (e) => {
      if (e.key !== 'Enter' || e.isComposing === true) {
        return;
      }
      insertTag(newDivRef, 'br', null, e);
      e.preventDefault();
    };
  }, [divRef]);
}

export default usePressKey;
