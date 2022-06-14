import React from 'react';
import insertTag from '../function/insertTag';

function usePressKey(divRef: React.RefObject<HTMLDivElement>) {
  React.useEffect(() => {
    if (!divRef.current) {
      return;
    }

    divRef.current.onkeyup = () => {
      const { activeElement } = document;
      if (activeElement?.lastChild?.nodeName !== 'BR') {
        activeElement?.appendChild(document.createElement('br'));
      }
    };

    divRef.current.onkeydown = (e) => {
      if (e.key === 'Enter') {
        insertTag(divRef, 'br', null, e);
      }
    };
  }, [divRef]);
}

export default usePressKey;
