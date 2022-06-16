import React from 'react';
import insertTag from '../function/insertTag';

function usePressKey(editorRef: React.RefObject<HTMLDivElement>) {
  React.useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.onkeyup = () => {
      const { activeElement } = document;
      if (activeElement?.lastChild?.nodeName !== 'BR') {
        activeElement?.appendChild(document.createElement('br'));
      }
    };

    editorRef.current.onkeydown = (e) => {
      if (e.key === 'Enter') {
        insertTag(editorRef, 'br', null, e);
      }
    };
  }, [editorRef]);
}

export default usePressKey;
