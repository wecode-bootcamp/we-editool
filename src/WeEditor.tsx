import * as React from 'react';
import { WE_EDITOR_ID } from './common/const';
import usePressKey from './hook/usePressKey';

const WeEditor = React.forwardRef<WeEditorRef, WeEditorProps>(
  ({ htmlState, setHTMLState, ...divProps }, forwardedRef) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(forwardedRef, () => ({
      getHTMLState: () => containerRef.current?.innerHTML,
    }));

    usePressKey(containerRef);

    const { onInput } = useOnInputCallback({ setHTMLState });

    return <div {...divProps} contentEditable ref={containerRef} onInput={onInput} />;
  }
);

export default WeEditor;

export interface WeEditorRef {
  getHTMLState: () => string | undefined;
}

export interface WeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  htmlState?: string;
  setHTMLState?: React.Dispatch<React.SetStateAction<string>>;
}

function useOnInputCallback({ setHTMLState }: UseOnInputProps) {
  const onInput = React.useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      if (setHTMLState) {
        setHTMLState(event.currentTarget.innerHTML);
      }
    },
    [setHTMLState]
  );

  return { onInput };
}

interface UseOnInputProps {
  setHTMLState?: React.Dispatch<React.SetStateAction<string>>;
}
