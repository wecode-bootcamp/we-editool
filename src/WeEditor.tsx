import React, { useCallback, useEffect, useRef } from 'react';
import Toolbar from './Toolbar';

export const WeEditor = React.forwardRef<WeEditorRef, WeEditorProps>(
  ({ htmlString, setHTMLString, className, placeholder, autofocus, disabled, maxLength }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { onInput } = useInput({ setHTMLString });

    useSelection();

    React.useImperativeHandle(forwardedRef, () => ({
      getHTMLString: () => containerRef.current && containerRef.current.innerHTML,
    }));

    return (
      <>
        <div id="weEditorContainer" contentEditable ref={containerRef} onInput={onInput} />
        <Toolbar containerRef={containerRef} />
      </>
    );
  }
);

export interface WeEditorRef {
  getHTMLString: () => string | null;
}

export interface WeEditorProps {
  htmlString?: string;
  setHTMLString?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  placeholder?: string;
  autofocus?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

interface UseInputProps {
  setHTMLString?: React.Dispatch<React.SetStateAction<string>>;
}
function useInput({ setHTMLString }: UseInputProps) {
  const onInput = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      if (setHTMLString) {
        setHTMLString(event.currentTarget.innerHTML);
      }
    },
    [setHTMLString]
  );

  return { onInput };
}

function useSelection() {
  useEffect(() => {
    const selectCB = () => {};
    document.addEventListener('select', selectCB);
    return () => {
      document.removeEventListener('select', selectCB);
    };
  }, []);
}
