import * as React from 'react';

import { WE_EDITOR_ID } from './common/const';
import usePressKey from './hook/usePressKey';

import { WeToolbar } from './WeToolbar';
import { htmlToMarkdown, markdownToHTML } from './module/markdown';

export interface WeEditorRef {
  getHTML: () => string;
  getMarkdown: () => string;
}

export interface WeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  initialHTML?: string;
  initialMarkdown?: string;
}

/**
 * `WeEditor` is lightweight, tag-less and simple editor.
 *
 *
 * ```typescript
 * import { WeEditor, WeEditorRef } from "we-editor";
 * function ReactFunctionComponent() {
 *   const editorRef = useRef<WeEditorRef>();
 *
 *   const getHTML = () =>
 * editorRef.current?.getHTML();
 *   const getMarkdown = () =>
 * editorRef.current?.getMarkdown();
 *
 *   return <WeEditor ref={editorRef} />;
 * }
 * ```
 */
export const WeEditor = React.forwardRef<WeEditorRef, WeEditorProps>(
  ({ initialHTML, initialMarkdown, ...divProps }, forwardedRef) => {
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (initialHTML && initialMarkdown) {
        console.warn('we-editool: html state will override because markdown state imported together');
      }

      if (divRef.current && initialHTML) {
        divRef.current.innerHTML = initialHTML;
      }

      if (divRef.current && initialMarkdown) {
        divRef.current.innerHTML = markdownToHTML(initialMarkdown);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useImperativeHandle(forwardedRef, () => ({
      getHTML: () => divRef.current?.innerHTML ?? '',
      getMarkdown: () => htmlToMarkdown(divRef.current?.innerHTML ?? ''),
    }));

    usePressKey(divRef);

    return (
      <>
        <div {...divProps} contentEditable id={WE_EDITOR_ID} ref={divRef} />
        <WeToolbar editorRef={divRef} />
      </>
    );
  }
);
