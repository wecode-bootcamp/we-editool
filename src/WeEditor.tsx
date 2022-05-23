import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

interface WeEditorProps {
  htmlString?: string;
  setHTMLString?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  placeholder?: string;
  autofocus?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

interface WeEditorRef {
  getHTMLString: () => string | null;
}

const WeEditor = React.forwardRef<WeEditorRef, WeEditorProps>(
  (
    {
      htmlString = '',
      setHTMLString = undefined,
      className = '',
      placeholder = '',
      autofocus = false,
      disabled = false,
      maxLength,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const getHTMLString = () => containerRef.current && containerRef.current.innerHTML;

    React.useImperativeHandle(ref, () => ({
      getHTMLString,
    }));

    useEffect(() => {
      document.addEventListener('selectionchange', () => {});

      return () => {
        document.removeEventListener('selectionchange', () => {});
      };
    }, []);

    return (
      <div
        contentEditable
        ref={containerRef}
        onInput={(event) => {
          if (setHTMLString) {
            setHTMLString(event.currentTarget.innerHTML);
          }
        }}
      />
    );
  }
);

export default WeEditor;
