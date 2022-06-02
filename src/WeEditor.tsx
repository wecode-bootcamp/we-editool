import * as React from 'react';
import Toolbar from './Toolbar';

export const WeEditor = React.forwardRef<WeEditorRef, WeEditorProps>(
  ({ htmlString, setHTMLString, className, placeholder, autofocus, disabled, maxLength }, forwardedRef) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const { onInput } = useInput({ setHTMLString });
    const [undoList, setUndoList] = React.useState<string[]>(['']);

    React.useEffect(() => {
      if (autofocus) containerRef?.current?.focus();

      if (containerRef?.current) {
        containerRef.current.onkeyup = () => {
          const a = document.activeElement;
          if (a?.lastChild?.nodeName !== 'BR') {
            a?.appendChild(document.createElement('br'));
          }
        };
        containerRef.current.onkeydown = (e) => {
          const ctrlZFunction = () => {
            if (undoList.length > 0) containerRef.current!.innerHTML = undoList.pop()!;
            setUndoList(undoList);
          };

          if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
            e.preventDefault();
            ctrlZFunction();
          }

          if (e.key === 'Enter') {
            e.preventDefault();

            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            if (range?.commonAncestorContainer?.parentElement?.id === 'weEditorContainer') {
              const br = document.createElement('br');
              range?.deleteContents();
              range?.insertNode(br);
              range?.setStartAfter(br);
              range?.setEndAfter(br);
              range?.collapse(false);
              selection?.removeAllRanges();
              if (range) selection?.addRange(range);
            }
          }
        };
      }
    }, []);

    function insertImage() {
      const url = prompt('이미지 URL을 입력하세요', '');
      if (url?.length && url.length > 0) {
        document.execCommand('insertImage', false, url);
      }
    }

    useSelection();

    React.useImperativeHandle(forwardedRef, () => ({
      getHTMLString: () => containerRef.current && containerRef.current.innerHTML,
    }));

    return (
      <>
        <div
          className={className}
          placeholder={placeholder}
          id="weEditorContainer"
          contentEditable={disabled}
          ref={containerRef}
          onInput={(e) => {
            onInput(e);
            if (containerRef.current?.innerHTML) undoList.push(containerRef.current.innerHTML);
            setUndoList(undoList);
          }}
        />
        <Toolbar containerRef={containerRef} setUndoList={setUndoList} undoList={undoList} />
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
  const onInput = React.useCallback(
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
  React.useEffect(() => {
    const selectCB = () => {};
    document.addEventListener('select', selectCB);
    return () => {
      document.removeEventListener('select', selectCB);
    };
  }, []);
}
